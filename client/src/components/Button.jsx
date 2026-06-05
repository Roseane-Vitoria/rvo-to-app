import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon,
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/30 px-6 py-3 text-base",
    secondary:
      "border border-white/10 hover:border-violet-500/35 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 text-sm",
    danger: "bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 px-5 py-2.5 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : Icon ? (
        <Icon className="h-5 w-5" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
