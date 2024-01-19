const crypto = require('crypto');
const { hashOtp } = require('./hash-services');
exports.generateOtp = async () => {
    const otp = await crypto.randomInt(1000,9999);
    return otp;
};
exports.sendOtpBySMS = async (otp) => {
    const accountSid = process.env.OTP_TWILIO_ACCOUNT_SID;
    const authToken = process.env.OTP_TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            from:'+12056712636',
            to: '+918728929478',
            body:`Your Coderhouse OTP is ${otp}`,
        })
};
exports.verifyOTP = async (hashedOtp,data) => {
    const computedHash = await hashOtp(data);
    return hashedOtp===computedHash;
};