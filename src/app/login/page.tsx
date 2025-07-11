"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "./OtpInput";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpResendCount, setOtpResendCount] = useState(0);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password) {
      // Password login (future extensibility)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone || undefined,
          email: email || undefined,
          password,
        }),
      });
      setLoading(false);
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } else {
      // OTP flow
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone || undefined,
          email: email || undefined,
        }),
      });
      setLoading(false);
      if (res.ok) {
        setStep("verify"); // Show OTP input
      } else {
        const data = await res.json();
        setError(data.error || "Failed to request OTP");
      }
    }
  }

  async function handleVerifyOtp(otpValue: string) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone || undefined,
        email: email || undefined,
        otp: otpValue,
      }),
    });
    setLoading(false);
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      setError(data.error || "Invalid OTP");
    }
  }

  async function handleResendOtp() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone || undefined,
        email: email || undefined,
      }),
    });
    setLoading(false);
    setOtpResendCount(otpResendCount + 1);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to resend OTP");
    }
  }

  if (token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Login successful! 🎉</h2>
          <div className="break-all text-xs bg-gray-100 p-2 rounded">
            {token}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">
          Hi, Welcome Back! <span className="inline-block">👋</span>
        </h2>
        {step === "request" && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-500 mb-1">
                Index Number or Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="233XXXXXXXXX"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                autoComplete="tel"
              />
            </div>
            <div className="relative">
              <label className="block text-gray-500 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Remember Me</span>
              </label>
              <span className="text-sm text-pink-400 cursor-pointer">
                Forgot Password?
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              {loading ? <span className="loader mx-auto" /> : "Sign In"}
            </button>
          </form>
        )}
        {step === "verify" && (
          <>
            <OtpInput
              phone={phone}
              onBack={() => setStep("request")}
              onSubmit={handleVerifyOtp}
              resendOtp={handleResendOtp}
              resendTimer={30}
            />
            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
          </>
        )}
        {error && step === "request" && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
      </div>
      {/* Loader spinner style */}
      <style>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
