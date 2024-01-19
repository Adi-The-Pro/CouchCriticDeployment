const crypto = require('crypto');
const a = crypto.randomBytes(32).toString('hex');
console.log(a);