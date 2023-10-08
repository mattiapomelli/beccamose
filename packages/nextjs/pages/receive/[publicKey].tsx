import type { NextPage } from "next";
import { useHasMounted } from "~~/hooks/useHasMounted";
import { useReceive } from "~~/sdk-new/hooks/useReceive";
import { useDerivedAccount } from "~~/sdk/crypto";

const InvitePage: NextPage = () => {
  const hasMounted = useHasMounted();
  const { derivedAccount } = useDerivedAccount();

  useReceive();

  if (!hasMounted) {
    return null;
  }

  return (
    <div>
      <div>Send</div>

      <div>Public key: {derivedAccount?.account.publicKey}</div>
      <div>Private key: {derivedAccount?.privateKey}</div>
    </div>
  );
};

export default InvitePage;
