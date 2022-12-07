const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('authorization: ', authorization);
  // authType: 인증 타입, authToken: 인증 토큰
  const [authType, authToken] = (authorization || '').split(' '); // ['Bearer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...']
  console.log('authType: ', authType);
  console.log('authToken: ', authToken);

  // Bearer: JWT 혹은 OAuth에 대한 토큰을 사용한다. (RFC 6750)
  if (authType !== 'Bearer' || !authToken) {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, 'customized-secret-key');
    console.log('userId: ', userId);
    User.findByPk(userId).then((user) => {
      console.log('user: ', user);
      // res.locals.user
      // 이 미들웨어를 사용하는 라우터에서는 굳이 데이터베이스에서 사용자 정보를 가져오지 않게 할 수 있도록
      // express가 제공하는 안전한 변수에 담아두고 언제나 꺼내서 사용할 수 있게 작성
      res.locals.user = user; // locals: 특정 장소의
      next(); // 미들웨어 마치면 다음 미들웨어로 넘어가라
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
  }
};
