import { ReactNode, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { enrTree, wakuDnsDiscovery } from "@waku/dns-discovery";
import { Protocols } from "@waku/interfaces";
import { wakuPeerExchangeDiscovery } from "@waku/peer-exchange";
import { ContentPairProvider, LightNodeProvider } from "@waku/react";
import NextNProgress from "nextjs-progressbar";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { CONTENT_TOPIC } from "~~/sdk";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const Main = ({ children }: { children: ReactNode }) => {
  const { isDarkMode } = useDarkMode();
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  return (
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
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </RainbowKitProvider>
      </ContentPairProvider>
    </LightNodeProvider>
  );
};

function fallbackRender({ error, resetErrorBoundary }: any) {
  resetErrorBoundary();

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit

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
    <ApolloProvider client={apolloClient}>
      <WagmiConfig config={wagmiConfig}>
        <ErrorBoundary fallbackRender={fallbackRender} onError={() => console.log(">>>> ERROR <<<<")}>
          <Main>
            <Component {...pageProps} />
          </Main>
        </ErrorBoundary>
      </WagmiConfig>
    </ApolloProvider>
  );
};

export default ScaffoldEthApp;
