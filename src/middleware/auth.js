const jwt = require("jsonwebtoken");
const constant = require('./../utilities/constant')
const User = require("./../modules/user/model")

const { customResponse, customPagination } = require("./../utilities/customResponse")

// const isAuthorized = async (req, res, next) => {
//   let code, message;
//   const authorizationHeaader = req.headers.authorization;
//   let result;
//   if (authorizationHeaader) {
//     const secret = process.env.JWTSECRET || 'wasswesroffsecret';
//     const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
//     console.log(token,"===>")
//     const options = {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     };
//     try {
//       jwt.verify(token, secret, async function (err, decoded) {
//         if (err) {
//           code = 500;
//           message = err.message;
//           if (err.message === "invalid token") {
//             code = 401;
//           } else if (err.message === "jwt expired") {
//             code = 444;
//           }
//           const resData = customResponse({
//             code,
//             message,
//             err,
//           });
//           return res.status(code).send(resData);
//         }
//         const user = await userModel.findOne({ "tokens.accessToken": token });
//         if (!user) {
//           code = 401;
//           message = constant.TOKEN_INVALID_MSG;
//           const resData = customResponse({
//             code,
//             message,
//           });
//           return res.status(code).send(resData);
//         }
//         result = jwt.verify(token, process.env.JWTSECRET, options);
//         req.decodedUser = result;
//         next();
//       });
//     } catch (error) {
//       console.log("error in isAuthorization", error);
//       code = 401;
//       message = constant.TOKEN_INVALID_MSG;
//       const resData = customResponse({
//         code,
//         message,
//         err: error,
//       });
//       return res.status(code).send(resData);
//     }
//   } else {
//     code = 401;
//     message = constant.AUTHENTICATION_ERR_MSG;
//     const resData = customResponse({ code, message });
//     return res.status(code).send(resData);
//   }
// };
// const adminAccess = (req,res,next) => {

//   console.log('admin check',req.decodedUser)
//     return (req, res, next) => {
//       let code, message;
//       try {
//         if (req.decodedUser.role=='admin') {
//           next();
//         } else {
//           code = constant.HTTP_403_CODE;
//           message = constant.FORBIDDEN_MSG;
//           const resData = customResponse({ code, message });
//           return res.status(code).send(resData);
//         }
//       } catch (error) {
//         console.log("error in admin access middleware", error);
//         code = 500;
//         const resData = customResponse({ code, message, err: error.message });
//         return res.status(code).send(resData);
//       }
//     };
//   };

//   module.exports = {
//     isAuthorized,
//     adminAccess,
//   };
  
const verifyToken = async (req, res, next) => {
    let code, message;
    const authorizationHeaader = req.headers.authorization;

    if (!authorizationHeaader) {
        code = 401;
        message = 'Authentication error. Token required.';
   
        return res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_401_CODE,
            message: message,
        }));

    }
    const secret = process.env.JWTSECRET;
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>

    try {
        jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                code = 500;
                message = err.message;
                if (err.message === "invalid token") {
                    code = 401;
                } else if (err.message === "jwt expired") {
                    code = 444;
                }
                
                return res.status(constant.HTTP_500_CODE).send(customResponse({
                    code: code,
                    message: message,
                }));
            }
            console.log(decoded,"===>>")
            
            req.decodedUser = decoded;
            next();
        });
    } catch (error) {
        return customResponse.failure(res,error)
    }

};

const verifyTokenAndUser = async (req, res , next)=>{
    try {

        await verifyToken(req, res, async () => {
            const decoded = req.decodedUser;
            console.log(decoded,"===",decoded.role)
            if (decoded.role !== "admin") {
              code = constant.HTTP_403_CODE;
              message = constant.FORBIDDEN_MSG;
              const resData = customResponse({ code, message });
              return res.status(code).send(resData);
            }

            next();
        })
    } catch (error) {
        return customResponse.failure(res,error)
    }


} 
module.exports = {
    verifyToken,
    verifyTokenAndUser
}  