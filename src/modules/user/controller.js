
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const constant = require('../../utilities/constant')
const { customResponse, customPagination } = require("../../utilities/customResponse")
const User = require("./model")




const getAllUser = async (req, res) => {
    console.log('testing code is running from model route with params')
    const data = [234234, 134, 23, 4, 234, 32, 4, 32, 432, 4, 32, 432, 4324, 32432, 432, 4, 324, 32, 234, 32, 4, 32, 43, 24, 32, 4, 324, 23]
    const data2 = customPagination(data, 1, 10)
    return res.status(200).send(customResponse({
        code: constant.HTTP_200_CODE,
        message: "successful message from custom res and page",
        data: data2
    }))

}
const registerUser = async (req, res) => {
    try {
        const { userName, email, name, role, password } = req.body;

        // Check for required fields
        if (!userName || !email || !name || !password ) {
            return res.status(constant.HTTP_400_CODE).send(customResponse({
                code: constant.HTTP_400_CODE,
                message: "userName, email, name,  and  password are required",
            }));
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username: userName }, { email: email }] });
        if (existingUser) {
            return res.status(constant.HTTP_400_CODE).send(customResponse({
                code: constant.HTTP_400_CODE,
                message: "Username or email is already registered",
            }));
        }

        // Set a default role if not provided
        const userRole = role ? role.toLowerCase() : 'user';

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(Number.parseInt(process.env.ENC_SALT_ROUND));
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username: userName,
            email: email,
            name: name,
            password: hashPassword,
            role: userRole,
            tokens: {}
        });

        // Generate JWT tokens
        const { accessToken, accessTokenExpiry } = await user.generateAccessToken();
        const { refreshToken, refreshTokenExpiry } = await user.generateRefreshToken();

        // Save the user to the database
        await user.save();

        return res.status(constant.HTTP_201_CODE).send(customResponse({
            code: constant.HTTP_201_CODE,
            message: "User has been created",
            data: {
                accessToken,
                accessTokenExpiry,
                refreshToken,
                refreshTokenExpiry
            }
        }));
    } catch (err) {
        console.log(err, "-->>>");
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }));
    }


}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(constant.HTTP_401_CODE).send(customResponse({
                code: constant.HTTP_401_CODE,
                message: constant.WRONG_PASSWORD
            }))
        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(constant.HTTP_401_CODE).send(customResponse({
                code: constant.HTTP_401_CODE,
                message: constant.WRONG_PASSWORD
            }))
        }
        const { accessToken, accessTokenExpiry } = await user.generateAccessToken()
        const { refreshToken, refreshTokenExpiry } = await user.generateRefreshToken()
        const data = {
            accessToken: accessToken,
            accessTokenExpiry: accessTokenExpiry,
            refreshToken: refreshToken,
            refreshTokenExpiry: refreshTokenExpiry
        }
        return res.status(constant.HTTP_200_CODE).send(customResponse({
            code: constant.HTTP_200_CODE,
            message: constant.LOGIN_SUCCESS,
            data: data
        }))
    }
    catch (err) {
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }))
    }


}
const reGenerateAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(constant.HTTP_401_CODE).send(customResponse({
                code: constant.HTTP_401_CODE,
                message: constant.REFRESH_TOKEN_MISSING
            }))
        }

        const user = await User.findOne({ 'tokens.refreshToken': refreshToken })
        if (!user) {
            return res.status(constant.HTTP_401_CODE).send(customResponse({
                code: constant.HTTP_401_CODE,
                message: constant.REFRESH_TOKEN_INVALID
            }))

        }
        const jwtSecret = process.env.JWTSECRET
        jwt.verify(refreshToken, jwtSecret, async (err, data) => {
            if (err) {
                res.status(constant.HTTP_401_CODE).send(customResponse({
                    code: constant.HTTP_401_CODE,
                    message: constant.ACCESS_TOKEN_INVALID
                }))

            }
            if (data) {
                const { accessToken, accessTokenExpiry } = await user.generateAccessToken()
                const { refreshToken, refreshTokenExpiry } = await user.generateRefreshToken()
                const data = {
                    accessToken: accessToken,
                    accessTokenExpiry: accessTokenExpiry,
                    refreshToken: refreshToken,
                    refreshTokenExpiry: refreshTokenExpiry
                }
                return res.status(constant.HTTP_200_CODE).send(customResponse({
                    code: constant.HTTP_200_CODE,
                    message: constant.TOKEN_RENEW_SUCCESS,
                    data: data
                }))

            }
        })

    }
    catch (err) {
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }))
    }


}
const checkAuth = async (req, res) => {
    try {
        console.log("authorized")
        res.sendStatus(200)
    }
    catch (err) {
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }))
    }


}
module.exports = {
    getAllUser,
    registerUser,
    loginUser,
    reGenerateAccessToken,
    checkAuth
}