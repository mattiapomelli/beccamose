import Link from "next/link";
import type { NextPage } from "next";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { CopyButton } from "~~/components/CopyButton";
import { MetaHeader } from "~~/components/MetaHeader";
import { QrCode } from "~~/components/QrCode";
import { Button } from "~~/components/ui/Button";
// import { CopyButton } from "~~/components/ui/CopyButton";
// import { useBurnerWallet } from "~~/hooks/scaffold-eth";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useDerivedAccount } from "~~/sdk/crypto";

const InvitePage: NextPage = () => {
  const { derivedAccount } = useDerivedAccount();

  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return null;
  }

  return (
    <div>
      <MetaHeader title="Beccamose | Invite" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full flex-1">
        <Link href={"/"}>
          <Button className="whitespace-nowrap" variant={"outline"} leftIcon={<ArrowLeftIcon className="w-5 h-5" />}>
            Back
          </Button>
        </Link>

        <div className="flex flex-col gap-y-2 items-center justify-center mt-4">
          <h2 className="text-xl font-bold">Share the QR Code</h2>
          <QrCode address={`${window.location.origin}/invite/${derivedAccount?.account.publicKey}`} />
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center w-full">
          <h2 className="text-xl font-bold">Or share the invitation link</h2>
          <p className="bg-base-100 rounded-btn p-4 w-full text-center border-2 border-base-300 break-words max-w-[400px]">
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

      {/* <div className="bg-warning rounded-md p-4 mt-10">
        <h3 className="font-bold">Debug Zone</h3>
        <div className="break-words">Public key: {derivedAccount?.account.publicKey}</div>
        <div className="break-words">Private key: {derivedAccount?.privateKey}</div>
      </div> */}
    </div>
  );
};

export default InvitePage;
