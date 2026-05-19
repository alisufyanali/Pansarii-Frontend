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
      className="p-2 hover:bg-gray-50 rounded-lg transition-all active:bg-gray-100"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="w-5 h-5 flex flex-col justify-center items-center gap-[3px]">
        <div className={`w-full h-[2px] bg-gray-700 transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></div>
        <div className={`w-full h-[2px] bg-gray-700 transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-full h-[2px] bg-gray-700 transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></div>
      </div>
    </button>
  );
}
