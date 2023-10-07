import { useEffect, useState } from "react";
import type { PeerId } from "@libp2p/interface-peer-id";
import { Peer } from "@libp2p/interface-peer-store";
import { IFilter, ILightPush, IStore, LightNode } from "@waku/interfaces";
import { useWaku } from "@waku/react";

function getPeerIdsForProtocol(protocol: IStore | ILightPush | IFilter | undefined, peers: Peer[]) {
  return protocol ? peers.filter(p => p.protocols.includes(protocol.multicodec)).map(p => p.id) : [];
}

export type UsePeersResults = {
  allConnected?: PeerId[];
  storePeers?: PeerId[];
  filterPeers?: PeerId[];
  lightPushPeers?: PeerId[];
};

export const useConnectedPeers = () => {
  const { node } = useWaku<LightNode>();

  const [peers, setPeers] = useState<UsePeersResults>({});

  useEffect(() => {
    if (!node) {
      return;
    }

    const listener = async () => {
      // find all the peers that are connected for diff protocols
      try {
        const peerIds = node.libp2p.getPeers();
        const peers = await Promise.all(peerIds.map(id => node.libp2p.peerStore.get(id)));

        setPeers({
          allConnected: peers.map(p => p.id),
          storePeers: getPeerIdsForProtocol(node.store, peers),
          filterPeers: getPeerIdsForProtocol(node.filter, peers),
          lightPushPeers: getPeerIdsForProtocol(node.lightPush, peers),
        });
      } catch (error) {
        console.log("Error getting peers: ", error);
      }
    };

    listener(); // populate peers before event is invoked
    node.libp2p.addEventListener("peer:identify", listener);
    return () => {
      node.libp2p.removeEventListener("peer:identify", listener);
    };
  }, [node, setPeers]);

  return peers;
};
