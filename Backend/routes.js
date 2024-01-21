const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, refresh, logout } = require('./Controllers/auth-controller');
const { activate } = require('./Controllers/activate-controller');
const authMiddleware = require('./Middlewares/auth-middleware');
const { create, index, show } = require('./Controllers/rooms-controller');

router.post('/api/otp-send', sendOtp);
router.post('/api/verify-otp',verifyOtp);
router.post('/api/activate',authMiddleware,activate);
router.get('/api/refresh',refresh);
router.post('/api/logout',authMiddleware,logout);
router.post('/api/rooms',authMiddleware,create);
router.get('/api/rooms',index);
router.get('/api/rooms/:roomId',show);
module.exports = router;