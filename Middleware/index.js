const jwtExpress = require('express-jwt');
const { getUserById } = require('../Controllers/dao/impl/db/user');
const { errorResMsg } = require('../Utils/libs/response');

const secret = process.env.COIN_INVESTIFY_JWT_SECRET;

// Check if your are authorized for the route
const authorize = (roleIds = []) => {
  if (typeof roleIds === 'string') {
    // eslint-disable-next-line no-param-reassign
    roleIds = [roleIds];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwtExpress({ secret, algorithms: ['HS256'] }),

    // authorize based on user role
    (req, res, next) => {
      if (roleIds.length && !roleIds.includes(req.user.userRole)) {
        // user's role is not authorized
        return errorResMsg(
          res,
          401,
          `User Role: ${req.user.userRole} does not have permission to perform this action or access this route`
        );
      }

      // authentication and authorization successful
      next();
      return false;
    },
  ];
};

// const accountActivated = (req, res, next) => {
//   const { userId } = req.user;
//   (async () => {
//     const userData = await getUserById(userId);
//     if (userData && userData.status === '0')
//       return errorResMsg(res, 401, 'Email needs to be verified first');
//     next();
//     return false;
//   })();
// };

module.exports = {
  authorize,
};
