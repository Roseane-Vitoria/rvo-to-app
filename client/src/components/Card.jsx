import React from "react";

export default function Card({
  children,
  title,
  subtitle,
  variant = "default", // 'default' | 'success' | 'warning' | 'danger'
  className = "",
}) {
  const borderVariants = {
    default: "border-white/5 bg-zinc-900/40 hover:border-white/10",
    success: "border-emerald-500/20 bg-emerald-950/5 hover:border-emerald-500/35",
    warning: "border-amber-500/20 bg-amber-950/5 hover:border-amber-500/35",
    danger: "border-red-500/20 bg-red-950/5 hover:border-red-500/35",
  };

  const glowVariants = {
    default: "bg-zinc-500/2",
    success: "bg-emerald-500/5",
    warning: "bg-amber-500/5",
    danger: "bg-red-500/5",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 p-6 ${borderVariants[variant]} ${className}`}
    >
      {/* Glow de fundo sutil */}
      <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full blur-2xl ${glowVariants[variant]} pointer-events-none`} />

      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white font-outfit tracking-wide flex items-center gap-2">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="relative z-10 text-sm text-zinc-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
