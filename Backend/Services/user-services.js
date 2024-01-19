const User = require('../Models/user');
exports.findUser = async (filter) => {
    const user = await User.findOne(filter);
    return user;
};
exports.createUser = async (data) => {
    const user = await User.create(data);
    return user;
};