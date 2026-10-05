import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

const Header = ({ title, subtitle, eyebrow = "Admin", actions }: HeaderProps) => (
  <div className="flex items-end justify-between flex-wrap gap-4">
    <div>
      <p className="text-[11px] uppercase tracking-wider text-[#9CA1B5] mb-2">{eyebrow}</p>
      <h1
        className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#F3F4F8] via-[#C9D4FF] to-[#D9B8FF] bg-clip-text text-transparent"
      >
        {title}
      </h1>
      {subtitle && <p className="text-[#9CA1B5] mt-1.5 text-sm">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

export default Header;