import React, { useState } from "react";

interface AvatarProps {
  name: string; src?: string; size?: number; className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 50, className = "" }) => {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#8EA9FF] to-[#C49BFA] text-[#101321] font-bold ${className}`}
    >
      {showImage ? (
        <img src={src} alt={name} onError={() => setFailed(true)} className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.36 }}>{name?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;