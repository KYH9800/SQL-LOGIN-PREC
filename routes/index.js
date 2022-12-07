const express = require('express');
const router = express.Router();
// router
const loginRouter = require('./login');
const signupRouter = require('./signup');
const userRouter = require('./user');
const goodsRouter = require('./goods');

router.get('/', (req, res, next) => {
  res.send('wellcome to shoping-mall!!');
});

router.use('/auth', loginRouter); // 로그인
router.use('/users', signupRouter); // 회원가입
router.use('/users', userRouter); // 내 정보 조회
router.use('/goods', goodsRouter); // 내 장바구니 목록 전부 조회

module.exports = router;
