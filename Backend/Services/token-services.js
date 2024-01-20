const jwt = require('jsonwebtoken');
const RefreshToken = require('../Models/refreshToken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
exports.generateToken = async (payload) => {
    const accessToken = jwt.sign(payload, accessTokenSecret,{
        expiresIn: '1m'
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret,{
        expiresIn: '1y'
    });
    return {accessToken, refreshToken};
};
exports.storeRefreshToken = async (token,userId) => {
    try{
        await RefreshToken.create({token,userId});
    }catch(err){
        console.log(err.message);
    }
};
exports.findRefreshToken = async (userId,refreshToken) => {
    //this will send the refreshToken if it finds it
    return await RefreshToken.findOne({ userId:userId,token:refreshToken});
};
exports.updateRefreshToken = async (userId,refreshToken) => {
    return await RefreshToken.updateOne({userId:userId},{token:refreshToken});
};
exports.verifyAcccessToken = async (token) => {
    return jwt.verify(token,accessTokenSecret);
};
exports.verifyRefreshToken = async (token) => {
    return jwt.verify(token,refreshTokenSecret);
};
exports.removeToken = async (refreshToken) => {
    return await RefreshToken.deleteOne({token:refreshToken})
}