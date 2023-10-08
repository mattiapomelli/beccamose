import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Spinner } from "~~/components/Spinner";
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
    <section className="flex flex-col gap-y-4 items-center justify-center w-full">
      <h1 className="w-full text-center font-bold text-xl mb-2">Start to share your location</h1>
      <div className="flex flex-col gap-y-4 items-center justify-center w-full">
        <Link href={`/chat/${inviterPublicKey}`}>
          <button className="btn btn-primary min-w-[15rem]">Start</button>
        </Link>
        <Link href="/">
          <button className="btn btn-secondary min-w-[15rem]">Decline</button>
        </Link>
      </div>
    </section>
  );
};

export default InvitePage;
