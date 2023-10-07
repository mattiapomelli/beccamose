import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CopyButton } from "~~/components/ui/CopyButton";
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
      <div>Public key: {derivedAccount?.account.publicKey}</div>
      <div>Private key: {derivedAccount?.privateKey}</div>
      <div>
        {window.location.origin}/invite/{derivedAccount?.account.publicKey}
      </div>
      <CopyButton text={`${window.location.origin}/invite/${derivedAccount?.account.publicKey}`}>Copy</CopyButton>
      <Link href={"/chats"}>Chats</Link>
    </div>
  );
};

export default InvitePage;
