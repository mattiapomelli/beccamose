import { useEffect, useState } from "react";
import { LightNode } from "@waku/interfaces";
import { useWaku } from "@waku/react";

export const usePeerId = () => {
  const { node } = useWaku<LightNode>();

  const [peerId, setPeerId] = useState<string | undefined>();

  useEffect(() => {
    if (!node) {
      return;
    }

    const listener = async () => {
      // find all the peers that are connected for diff protocols
      const peerId = node?.libp2p.peerId.toString();
      setPeerId(peerId);
    };

    listener(); // populate peers before event is invoked

    node.libp2p.addEventListener("peer:identify", listener);

    return () => {
      node.libp2p.removeEventListener("peer:identify", listener);
    };
  }, [node]);

  return peerId;
};
