import React from 'react';

interface BackwardArrowProps {
  onClick: () => void;
  disabled: boolean;
}

export default function BackwardArrow({ onClick, disabled }: BackwardArrowProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-[36px] h-[36px] rounded-full transition
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "me-bgcolor-g"}`}
    >
      <span
        className={`font-semibold text-xl -mt-0.5 tracking-tighter ${
          disabled ? "text-gray-400" : "text-white"
        }`}
      >
        ‹
      </span>
    </button>
  );
}