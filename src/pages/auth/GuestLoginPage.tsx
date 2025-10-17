import { useState, FormEvent } from "react";
import { Building2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  authenticateGuest,
  setGuestSession,
} from "../../services/guestAuth.service";

export const GuestLoginPage = () => {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Authenticate the guest using room number and verification code
      const result = await authenticateGuest(roomNumber, accessCode);

      if (result.success && result.guestData && result.token) {
        // Store the guest session
        setGuestSession({
          token: result.token,
          guestData: result.guestData,
          hotelData: result.hotelData,
        });

        // Navigate to guest dashboard
        navigate("/guest/dashboard");
      } else {
        setError(result.error || "Invalid room number or access code");
      }
    } catch (err) {
      console.error("💥 [Guest Login] Authentication error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Guest Access</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your room details to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Room Number */}
            <div>
              <label
                htmlFor="roomNumber"
                className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2"
              >
                Room Number *
              </label>
              <input
                id="roomNumber"
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., 205"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Access Code */}
            <div>
              <label
                htmlFor="accessCode"
                className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2"
              >
                Access Code *
              </label>
              <div className="relative">
                <input
                  id="accessCode"
                  type={showPassword ? "text" : "password"}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="• • • • • •"
                  required
                  className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                6-digit code from check-in
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            {isLoading ? "Accessing..." : "Access"}
          </button>

          {/* Back to Staff Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Staff Login
            </button>
          </div>
        </form>
      </div>

      {/* Footer Badge */}
      <div className="fixed bottom-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-xs text-gray-600 flex items-center gap-1">
        <span className="font-bold">⚡</span> Made in Bolt
      </div>
    </div>
  );
};
