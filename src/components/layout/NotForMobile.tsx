import { Monitor } from "lucide-react";

export const NotForMobile = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center md:hidden p-4 space-y-4">
      <Monitor className="text-white w-12 h-12 opacity-80" />
      <p className="text-white text-sm font-bold text-center px-4 opacity-90">
        Diff-Space is not optimized for mobile. Please view on pc
      </p>

      <p className="text-white/40 text-xs opacity-90 text-center">who am i kidding? <br />I was just too lazy to make it work on mobile</p>
    </div>
  );
};
