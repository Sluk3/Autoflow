import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { base44 } from '../api/n8nClient';
import { hashPassword } from '../utils/crypto';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Show success page IMMEDIATELY
    setSubmittedEmail(email);
    setSuccess(true);

    // Send request in background (fire and forget)
    (async () => {
      try {
        const hashedPassword = await hashPassword(newPassword);
        await base44.entities.User.resetPassword(null, hashedPassword, email);
        console.log('✅ Password reset email request sent');
      } catch (err) {
        console.error('❌ Password reset error:', err);
        // Don't show error to user since they already see success page
      }
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="glass-morphism rounded-2xl p-8 w-full max-w-md">
        {success ? (
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-green-500/20 mb-4">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-slate-400 mb-6">
              We've sent a confirmation email to <span className="text-white font-medium">{submittedEmail}</span>
            </p>
            <div className="bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm font-medium mb-1">Next Steps:</p>
              <p className="text-xs">
                Click the link in the email to confirm your password reset. The link will expire in <strong>5 minutes</strong>.
              </p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 px-4 py-2 rounded-lg mb-6">
              <p className="text-xs">
                <strong>Note:</strong> Email delivery may take a few moments. Check your spam folder if you don't see it.
              </p>
            </div>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-yellow-500/20 mb-4">
                <KeyRound className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-slate-400">Enter your email and new password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-yellow-500 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-yellow-500 focus:outline-none"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-yellow-500 focus:outline-none"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>

              <p className="text-xs text-slate-400">
                Min 8 characters. You'll receive a confirmation email to approve the change.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Send Reset Email
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
