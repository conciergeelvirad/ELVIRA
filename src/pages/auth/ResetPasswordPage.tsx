import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // Exchange the token hash for a session
  useEffect(() => {
    const verifyAndSetSession = async () => {
      try {
        // Supabase uses hash fragments for auth tokens
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        // Also check URL params as fallback
        const urlParams = new URLSearchParams(window.location.search);

        // Check if Supabase returned an error instead of tokens
        const error = hashParams.get("error") || urlParams.get("error");
        const errorCode =
          hashParams.get("error_code") || urlParams.get("error_code");
        const errorDescription =
          hashParams.get("error_description") ||
          urlParams.get("error_description");

        if (error) {
          console.error("❌ Supabase auth error:", {
            error,
            errorCode,
            errorDescription,
          });

          // Handle specific error cases
          if (errorCode === "otp_expired" || error === "access_denied") {
            setError(
              "This reset link has expired. Password reset links are valid for 1 hour. Please request a new password reset."
            );
          } else {
            setError(
              `Reset link error: ${
                errorDescription || error
              }. Please request a new password reset.`
            );
          }
          setIsVerifying(false);
          return;
        }

        const accessToken =
          hashParams.get("access_token") || urlParams.get("access_token");
        const refreshToken =
          hashParams.get("refresh_token") || urlParams.get("refresh_token");
        const type = hashParams.get("type") || urlParams.get("type");

        console.log("🔍 Full URL:", window.location.href);
        console.log("🔍 Hash:", hash);
        console.log("🔍 Hash params:", {
          accessToken: accessToken
            ? accessToken.substring(0, 20) + "..."
            : null,
          refreshToken: !!refreshToken,
          type,
        });

        if (!accessToken || type !== "recovery") {
          console.error("❌ Missing or invalid tokens", {
            accessToken: !!accessToken,
            type,
          });
          setError("Invalid reset link. Please request a new password reset.");
          setIsVerifying(false);
          return;
        }

        // Set the session using the tokens from the URL
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        console.log("🔐 Session set result:", {
          hasSession: !!data?.session,
          hasUser: !!data?.user,
          error: sessionError?.message,
        });

        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          setError(
            "Failed to verify reset link. Please request a new password reset."
          );
        } else if (!data?.session) {
          console.error("❌ No session created");
          setError(
            "Failed to establish session. Please request a new password reset."
          );
        } else {
          console.log(
            "✅ Session established successfully for user:",
            data.user?.email
          );
        }
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAndSetSession();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to reset password. Please try again.");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while verifying the session
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">
              Password Reset Successful!
            </h1>
            <p className="mt-2 text-gray-600">
              Your password has been updated successfully.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ELVIRA MANAGEMENT</h1>
          <p className="mt-2 text-gray-600">SYSTEM</p>
          <p className="mt-4 text-lg font-medium">Reset Your Password</p>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                NEW PASSWORD
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                CONFIRM PASSWORD
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating Password..." : "Update Password"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 hover:text-black"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
