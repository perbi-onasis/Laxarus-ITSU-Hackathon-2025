"use client";
import { useEffect } from "react";

export type NotificationStatus = "success" | "error" | "info";

export default function Notification({
  message,
  status = "info",
  show,
  onClose,
  duration = 3000,
}: {
  message: string;
  status?: NotificationStatus;
  show: boolean;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  let color = "bg-blue-600";
  if (status === "success") color = "bg-green-600";
  if (status === "error") color = "bg-red-600";

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-center transition-all ${color}`}
      role="alert"
    >
      {message}
    </div>
  );
}
