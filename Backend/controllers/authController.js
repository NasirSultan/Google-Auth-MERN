const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ googleId, email, name, picture });
    } else if (!user.googleId || user.googleId !== googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const jwtToken = generateToken(user);
    return res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({ message: 'Invalid token', error });
  }
};

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
    });

    const token = generateToken(newUser);

    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};






const otpStore = []; // In-memory store for OTPs

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Step 1: Send OTP to email
const requestPasswordReset = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ message: 'Email and new password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    // Remove existing OTPs for the user
    const existingIndex = otpStore.findIndex(entry => entry.email === email);
    if (existingIndex !== -1) otpStore.splice(existingIndex, 1);

    otpStore.push({ email, otp, hashedPassword, expiresAt });

    // Send via Resend API
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'OTP for Password Reset',
        html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json({ message: 'OTP sent to your email address' });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ Step 2: Verify OTP and reset password
const verifyOtpAndResetPassword = async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ message: 'OTP is required' });

  const otpEntry = otpStore.find(entry => entry.otp === otp);
  if (!otpEntry || Date.now() > otpEntry.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const user = await User.findOne({ email: otpEntry.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = otpEntry.hashedPassword;
    await user.save();

    // Remove OTP from memory
    otpStore.splice(otpStore.indexOf(otpEntry), 1);

    return res.status(200).json({ message: '✅ Password has been reset successfully!' });
  } catch (error) {
    console.error("Reset Error:", error);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
};






module.exports = {
  googleLogin,
  register,
  login,
  requestPasswordReset,
  verifyOtpAndResetPassword,
};
