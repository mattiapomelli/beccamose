import Link from "next/link";
import { SwitchTheme } from "~~/components/SwitchTheme";

export const Header = () => {
  return (
    <div className="sticky top-0 left-0 bg-base-100 py-4 justify-between z-20">
      <div className="w-full flex items-center justify-between">
        <Link href="/">Beccamose</Link>
        <SwitchTheme />
      </div>
    </div>
  );
};
