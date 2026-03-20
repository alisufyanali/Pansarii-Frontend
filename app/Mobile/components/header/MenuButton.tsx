// app/Mobile/components/Header/MenuButton.tsx
"use client";

interface MenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function MenuButton({ onClick, isOpen }: MenuButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="p-2 group"
      aria-label="Open menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
        <div className={`w-5 h-0.5 bg-gray-700 group-hover:bg-green-600 transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
        <div className={`w-5 h-0.5 bg-gray-700 group-hover:bg-green-600 transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-5 h-0.5 bg-gray-700 group-hover:bg-green-600 transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
      </div>
    </button>
  );
}