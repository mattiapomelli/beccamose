import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Spinner } from "~~/components/Spinner";
import { Button } from "~~/components/ui/Button";
import { CopyButton } from "~~/components/ui/CopyButton";

const InvitePage: NextPage = () => {
  const router = useRouter();
  const inviteAddress = router.query.address?.toString();

  const { address, isConnecting, isReconnecting, isConnected } = useAccount();

  if (isConnecting || isReconnecting || !address || !isConnected) {
    return (
      <div className="my-14 flex justify-center">
        <Spinner />
      </div>
    );
  }

  // Connected user is inviting someone else
  if (inviteAddress && inviteAddress === address) {
    return (
      <div>
        <div>
          {window.location.origin}/invite/{inviteAddress}
        </div>
        <CopyButton text={`${window.location.origin}/invite/${inviteAddress}`}>Copy</CopyButton>
      </div>
    );
  }

  // Connected user has been invited
  return (
    <div>
      <p>Start to share location with {inviteAddress}</p>
      <div className="flex items-center gap-2">
        <Link href={`/chat/${inviteAddress}`}>
          <Button>Start</Button>
        </Link>
        <Button variant="outline">Decline</Button>
      </div>
    </div>
  );
};

export default InvitePage;
