import type { NextPage } from "next";
// import { CopyButton } from "~~/components/ui/CopyButton";
// import { useBurnerWallet } from "~~/hooks/scaffold-eth";
import { useHasMounted } from "~~/hooks/useHasMounted";

const InvitePage: NextPage = () => {
  // const { account } = useBurnerWallet();

  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return null;
  }

  // return (
  //   <div>
  //     <div>
  //       {window.location.origin}/invite/{account?.address}
  //     </div>
  //     <CopyButton text={`${window.location.origin}/invite/${account?.address}`}>Copy</CopyButton>
  //   </div>
  // );
};

export default InvitePage;
