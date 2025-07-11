"use client";
import { useState, useRef, useEffect } from "react";

export default function OtpInput({
  phone,
  onBack,
  onSubmit,
  resendOtp,
  resendTimer = 30,
}: {
  phone: string;
  onBack: () => void;
  onSubmit: (otp: string) => void;
  resendOtp: () => void;
  resendTimer?: number;
}) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(resendTimer);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleChange = (i: number, v: string) => {
    if (!/^[0-9]?$/.test(v)) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    if (v && i < otp.length - 1) {
      inputs.current[i + 1]?.focus();
    }
    if (newOtp.every((d) => d)) {
      onSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button
        className="self-start ml-4 mt-4 p-2 rounded-full border border-green-500"
        onClick={onBack}
        aria-label="Back"
      >
        <svg
          width={24}
          height={24}
          fill="none"
          stroke="green"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M15 18l-6-6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="w-full max-w-md p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Enter code</h2>
        <p className="mb-8 text-gray-600">
          We’ve sent an SMS with an activation code to your phone{" "}
          <span className="font-semibold">{phone}</span>
        </p>
        <div className="flex justify-center gap-4 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`w-16 h-16 text-2xl text-center border-2 rounded-xl outline-none ${
                digit ? "border-blue-600" : "border-gray-300"
              }`}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>
        <div className="text-gray-500">
          Send code again{" "}
          {timer > 0 ? (
            <span className="font-mono">{`00:${timer
              .toString()
              .padStart(2, "0")}`}</span>
          ) : (
            <button
              className="text-blue-600 underline"
              onClick={() => {
                setTimer(resendTimer);
                resendOtp();
              }}
            >
              Resend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
