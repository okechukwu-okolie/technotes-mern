import bcrypt from 'bcrypt'
import User from '../model/User.js'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'



// @desc Login
// @route POST /auth
// @access Public
export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are requiredccccc' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorizedaaaaaaa' })
    }

     

    if (!match) return res.status(401).json({ message: 'Unauthorizedbbbbbb' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
export const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    // Using a try/catch or letting asyncHandler catch the error
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        const foundUser = await User.findOne({ username: decoded.username }).exec()
        if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } 
        )

        res.json({ accessToken })
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden' })
    }
})

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
export const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

// module.exports = {
//     login,
//     refresh,
//     logout
// }