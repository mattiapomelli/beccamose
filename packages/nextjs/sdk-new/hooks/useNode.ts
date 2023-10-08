import { useQuery } from "@tanstack/react-query";
import { enrTree, wakuDnsDiscovery } from "@waku/dns-discovery";
import { wakuPeerExchangeDiscovery } from "@waku/peer-exchange";
import { Protocols, createLightNode, waitForRemotePeer } from "@waku/sdk";

export const useNode = () => {
  return useQuery({
    queryKey: ["waku-node"],
    queryFn: async () => {
      // Create and start a Light Node
      const node = await createLightNode({
        defaultBootstrap: false,
        libp2p: {
          peerDiscovery: [
            wakuDnsDiscovery([enrTree["PROD"]], { lightPush: 6, filter: 6, store: 6 }),
            wakuPeerExchangeDiscovery(),
          ],
        },
      });
      await node.start();

      // Wait for a successful peer connection
      await waitForRemotePeer(node, [Protocols.Filter, Protocols.LightPush, Protocols.Store]);

      console.log("Node is ready");

      return node;
    },
    staleTime: Infinity,
  });
};
