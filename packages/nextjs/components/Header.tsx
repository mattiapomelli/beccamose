import Image from "next/image";
import Link from "next/link";
import BeccamoseLogo from "~~/assets/logo.png";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Header = () => {
  return (
    <header className="sticky top-0 left-0 bg-base-100 py-4 justify-between z-20">
      <div className="w-full flex items-center justify-between layout-container">
        <Link href="/">
          <Image src={BeccamoseLogo} alt="Beccamose logo" width={110} />
        </Link>
        <div className="flex items-center gap-x-2">
          <RainbowKitCustomConnectButton />
          <SwitchTheme />
        </div>
      </div>
    </header>
  );
};
