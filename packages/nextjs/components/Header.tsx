import Link from "next/link";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Header = () => {
  return (
    <div className="sticky top-0 left-0 bg-base-100 py-4 justify-between z-20">
      <div className="w-full flex items-center justify-between">
        <Link href="/">Beccamose</Link>
        <div className="flex items-center gap-x-2">
          <RainbowKitCustomConnectButton />
          <SwitchTheme />
        </div>
      </div>
    </div>
  );
};
