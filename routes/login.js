const express = require('express');
const router = express.Router();
// jsonwebtoken
const jwt = require('jsonwebtoken');
// bcrypt
const bcrypt = require('bcrypt');
// SQL
const { User } = require('../models');

// POST /auth, 로그인 요청 (REST API 관점: 인증 정보를 "생성"해서 받아온다고 보면 POST 메서드가 적합)
// auth: Authenticate를 줄인 단어인데, 로그인 한다는 행위 자체를 "사용자가 자신의 정보를 인증한다" 라고 보기 때문에 일반적으로 로그인에 자주 사용되는 경로 중 하나
router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    const hashedPassword = await bcrypt.compare(password, user.password); // 입력한 pw가 user.password와 같으면 true
    console.log('hashedPassword: ', hashedPassword);

    if (!user || !hashedPassword) {
      res.status(400).send({
        errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
      });
      return;
    }

    res.status(200).send({
      token: jwt.sign(
        {
          userId: user.userId,
        },
        'customized-secret-key'
      ),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
