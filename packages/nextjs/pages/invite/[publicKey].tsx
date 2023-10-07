import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Spinner } from "~~/components/Spinner";
import { Button } from "~~/components/ui/Button";
import { CopyButton } from "~~/components/ui/CopyButton";

const InvitePage: NextPage = () => {
  const router = useRouter();
  const inviterPublicKey = router.query.publicKey?.toString();

  const { address, isConnecting, isReconnecting, isConnected } = useAccount();

  if (isConnecting || isReconnecting || !address || !isConnected) {
    return (
      <div className="my-14 flex justify-center">
        <Spinner />
      </div>
    );
  }

  // Connected user is inviting someone else
  if (inviterPublicKey && inviterPublicKey.toLowerCase() === address.toLowerCase()) {
    return (
      <div>
        <div>
          {window.location.origin}/invite/{inviterPublicKey}
        </div>
        <CopyButton text={`${window.location.origin}/invite/${inviterPublicKey}`}>Copy</CopyButton>
      </div>
    );
  }

  // Connected user has been invited
  return (
    <div>
      <p>Start to share location with {inviterPublicKey}</p>
      <div className="flex items-center gap-2">
        <Link href={`/chat/${inviterPublicKey}`}>
          <Button>Start</Button>
        </Link>
        <Button variant="outline">Decline</Button>
      </div>
    </div>
  );
};

export default InvitePage;
