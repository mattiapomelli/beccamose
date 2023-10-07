import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import { CopyButton } from "~~/components/CopyButton";
import { MetaHeader } from "~~/components/MetaHeader";
import { QrCode } from "~~/components/QrCode";
// import { CopyButton } from "~~/components/ui/CopyButton";
// import { useBurnerWallet } from "~~/hooks/scaffold-eth";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useDerivedAccountEncryption } from "~~/sdk/crypto";

const InvitePage: NextPage = () => {
  const { address } = useAccount();

  const { getDerivedAccount, isWalletClientLoaded } = useDerivedAccountEncryption();

  const { data: derivedAccount } = useQuery({
    queryKey: ["publicKey", address],
    queryFn: async () => {
      const derivedAccount = await getDerivedAccount();
      return derivedAccount;
    },
    enabled: isWalletClientLoaded,
  });

  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return null;
  }

  return (
    <div>
      <MetaHeader title="Beccamose | Invite" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full flex-1">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h2>Scan the QR Code</h2>
          {/* ToDo --> Fix link */}
          <QrCode address="https://www.google.it/" />
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center w-full">
          <h2>Use the invitation link</h2>
          <p className="bg-base-100 rounded-btn p-4 w-full text-center border-2 border-base-300">
            {/* ToDo --> Fix link */}
            {window.location.origin}/invite/{derivedAccount?.account.publicKey}
          </p>
          <CopyButton
            text={`${window.location.origin}/invite/${derivedAccount?.account.publicKey}`}
            className="btn btn-primary min-w-[15rem]"
          >
            {copied => (
              <>
                <ClipboardIcon className="h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </>
            )}
          </CopyButton>
        </div>
      </section>

      <div className="bg-warning rounded-md p-4 mt-10">
        <h3 className="font-bold">Debug Zone</h3>
        <div>Public key: {derivedAccount?.account.publicKey}</div>
        <div>Private key: {derivedAccount?.privateKey}</div>
      </div>
    </div>
  );
};

export default InvitePage;