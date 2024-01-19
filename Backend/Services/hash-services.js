const crypto = require('crypto');
exports.hashOtp = async (data) => {
    const hash = crypto.createHmac('sha256',process.env.HASH_SECRET).update(data).digest('hex');
    return hash;
}