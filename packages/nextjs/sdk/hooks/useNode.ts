import { useQuery } from "@tanstack/react-query";
import { createLightNode, waitForRemotePeer } from "@waku/sdk";

export const useNode = () => {
  return useQuery({
    queryKey: ["waku-node"],
    queryFn: async () => {
      // Create and start a Light Node
      const node = await createLightNode({ defaultBootstrap: true });
      await node.start();

      // Wait for a successful peer connection
      await waitForRemotePeer(node);

      return node;
    },
    staleTime: Infinity,
  });
};
