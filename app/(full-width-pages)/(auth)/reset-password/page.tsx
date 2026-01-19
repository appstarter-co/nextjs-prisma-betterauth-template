"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setTokenValid(false);
      setError("Invalid or missing reset token");
      return;
    }

    // You can add token validation here if your auth system supports it
    setTokenValid(true);
  }, [token]);

  useEffect(() => {
    // Check password strength
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError(resetError.message || "Failed to reset password");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (tokenValid === false) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full items-center justify-center">
        <div className="max-w-md space-y-8 p-8">
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This password reset link is invalid or has expired.
            </p>
            <div className="mt-6">
              <Link href="/login">
                <Button className="w-full">
                  <ChevronLeftIcon className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Password Reset Successful
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <div className="mt-6">
              <Button onClick={() => router.push("/login")} className="w-full">
                Continue to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full items-center justify-center">
      <div className="max-w-md space-y-8 p-8">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-8"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password Requirements:
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.length ? 'text-green-600' : 'text-gray-300'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-300'}`} />
                  One uppercase letter
                </div>
                <div className={`flex items-center ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-300'}`} />
                  One lowercase letter
                </div>
                <div className={`flex items-center ${passwordStrength.number ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.number ? 'text-green-600' : 'text-gray-300'}`} />
                  One number
                </div>
                <div className={`flex items-center ${passwordStrength.special ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 mr-2 ${passwordStrength.special ? 'text-green-600' : 'text-gray-300'}`} />
                  One special character
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Passwords do not match
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Passwords match
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !isPasswordValid || !passwordsMatch}
            className="w-full"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}