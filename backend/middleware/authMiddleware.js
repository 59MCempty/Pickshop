import jwt from 'jsonwebtoken'

import asyncHandler from './asyncHandler.js'
import User from "../models/userModel.js"

// Protect route
const protect = asyncHandler( async (req, res, next) => {
    let token;

    // Read token from cookie
    token = req.cookies.jwt

    if (token) {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decode.userId).select("-password")
            next()
        }
        catch (err) {
            console.error(err)
            res.status(401)
            throw new Error("Not Authorized, no token")
        }
    }
    else {
        res.status(401)
        throw new Error("Not Authorized, no token")
    }

})

const admin = asyncHandler( async (req, res, next) => {

    // Had logged in
    if (req.user && req.user.isAdmin) {
        next()
    }
    else {
        res.status(401)
        throw new Error("Not Authorized as admin")
    }
})

export { admin, protect}
