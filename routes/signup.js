const express = require('express');
const router = express.Router();
// bcrypt
const bcrypt = require('bcrypt');
// SQL
const { Op } = require('sequelize');
const { User } = require('../models');

// POST /users, 회원가입 요청
router.post('/', async (req, res, next) => {
  try {
    const { nickname, email, password, confirmPassword } = req.body;

    if (!nickname) {
      return res.status(400).send({
        errorMessage: '닉네임을 입력해주세요.',
      });
    }
    if (!email) {
      return res.status(400).send({
        errorMessage: '이메일을 입력해주세요.',
      });
    }
    if (!password) {
      return res.status(400).send({
        errorMessage: '비밀번호를 입력해주세요.',
      });
    }

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
      });
      return;
    }

    // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findAll({
      where: {
        [Op.or]: [{ email }, { nickname }],
      },
    });

    if (existsUsers.length) {
      res.status(400).send({
        errorMessage: '이메일 또는 닉네임이 이미 사용중입니다.',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('hashedPassword: ', hashedPassword);

    await User.create({
      email: email,
      nickname: nickname,
      password: hashedPassword,
    });

    return res.status(201).send({ success: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
