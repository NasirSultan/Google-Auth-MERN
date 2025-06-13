const express = require('express');
const router = express.Router();
const { googleLogin ,register,login , requestPasswordReset,verifyOtpAndResetPassword} = require('../controllers/authController');

router.post('/google-login', googleLogin);
router.post('/register', register);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset); // body: { email, newPassword }
router.post('/verify-otp-and-reset-password', verifyOtpAndResetPassword); // body: { email, otp }
module.exports = router;
