import { useState } from 'react';
import axios from 'axios';

export default function PasswordReset() {
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/request-password-reset', {
        email,
        newPassword,
      });
      setMessage(res.data.message);
      setStep('verify');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/verify-otp-and-reset-password', {
        otp,
      });
      setMessage(res.data.message || '✅ Password reset successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        {step === 'request' ? 'Reset Your Password' : 'Verify OTP'}
      </h2>

      <form onSubmit={step === 'request' ? handleRequestOTP : handleVerifyOTP} className="space-y-4">
        {step === 'request' && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </>
        )}

        {step === 'verify' && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 border rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition cursor-pointer"
          disabled={loading}
        >
          {loading
            ? 'Please wait...'
            : step === 'request'
            ? 'Click to Generate OTP'
            : 'Verify & Reset Password'}
        </button>
      </form>

      {message && (
        <p className="text-center text-sm mt-4 text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}
