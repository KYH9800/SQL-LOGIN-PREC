const express = require('express');
const router = express.Router();
// middleware
const authMiddleware = require('../middleware/auth-middleware');

// GET /users/me, 내 정보 조회
router.get('/me', authMiddleware, async (req, res, next) => {
  console.log('res.locals: ', res.locals);
  try {
    res.send({
      user: res.locals.user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
