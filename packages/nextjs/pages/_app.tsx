import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { enrTree, wakuDnsDiscovery } from "@waku/dns-discovery";
import { Protocols } from "@waku/interfaces";
import { wakuPeerExchangeDiscovery } from "@waku/peer-exchange";
import { ContentPairProvider, LightNodeProvider } from "@waku/react";
import "leaflet/dist/leaflet.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Layout } from "~~/components/Layout";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { CONTENT_TOPIC } from "~~/sdk";
import { DerivedAccountProvider } from "~~/sdk/crypto";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const queryClient = new QueryClient();
const ReactQueryDevtoolsProduction = dynamic(
  () =>
    // eslint-disable-next-line import/extensions
    import("@tanstack/react-query-devtools/build/lib/index.prod.js").then(d => ({
      default: d.ReactQueryDevtools,
    })),
  { ssr: false },
);

declare global {
  interface Window {
    toggleDevtools: () => void;
  }
}

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const { isDarkMode } = useDarkMode();
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  const [showDevtools, setShowDevtools] = useState(false);
  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools(old => !old);
  }, []);

  const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
  const apolloClient = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {showDevtools && <ReactQueryDevtoolsProduction />}
      <ApolloProvider client={apolloClient}>
        <WagmiConfig config={wagmiConfig}>
          <LightNodeProvider
            // options={{ defaultBootstrap: true }}
            options={{
              defaultBootstrap: false,
              libp2p: {
                peerDiscovery: [
                  wakuDnsDiscovery([enrTree["PROD"]], { lightPush: 6, filter: 6, store: 6 }),
                  wakuPeerExchangeDiscovery(),
                ],
              },
            }}
            protocols={[Protocols.Filter, Protocols.LightPush, Protocols.Store]}
          >
            <ContentPairProvider contentTopic={CONTENT_TOPIC}>
              <NextNProgress />
              <RainbowKitProvider
                chains={appChains.chains}
                avatar={BlockieAvatar}
                theme={isDarkTheme ? darkTheme() : lightTheme()}
              >
                <DerivedAccountProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                  <Toaster />
                </DerivedAccountProvider>
              </RainbowKitProvider>
            </ContentPairProvider>
          </LightNodeProvider>
        </WagmiConfig>
      </ApolloProvider>
    </QueryClientProvider>
  );
};

export default ScaffoldEthApp;
