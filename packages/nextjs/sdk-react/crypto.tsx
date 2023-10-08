import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import EthCrypto from "eth-crypto";
import { Hex, PrivateKeyAccount, hashMessage } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { WalletClient, useWalletClient } from "wagmi";

const DERIVATION_MESSAGE = "f98q3h4f98he9vn8928w9898ws98fh98h9h9f29h9hq9uhs9h92h9398h9qsh9ch01obepdpPI)U)U9h8H90W";

const generateDerivedAccount = async (walletClient: WalletClient) => {
  const signedMessage = await walletClient.signMessage({ message: DERIVATION_MESSAGE });
  const privateKey = hashMessage(signedMessage);
  const account = privateKeyToAccount(privateKey);

  return { privateKey, account };
};

type DerivedAccount = {
  privateKey: Hex;
  account: PrivateKeyAccount;
};

interface DerivedAccountContextType {
  derivedAccount: DerivedAccount | undefined;
}

const DerivedAccountContext = createContext<DerivedAccountContextType | null>(null);

const derivedAccountsCache = new Map<string, DerivedAccount>();

export const DerivedAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: walletClient } = useWalletClient();

  const { data: derivedAccount } = useQuery({
    queryKey: [walletClient?.account.address, walletClient],
    queryFn: async () => {
      if (!walletClient) throw new Error("Wallet client not initialized");

      if (derivedAccountsCache.has(walletClient.account.address)) {
        return derivedAccountsCache.get(walletClient.account.address) as DerivedAccount;
      }

      const derivedAccount = await generateDerivedAccount(walletClient);
      derivedAccountsCache.set(walletClient.account.address, derivedAccount);
      return derivedAccount;
    },
    enabled: !!walletClient?.account.address,
  });

  const value = {
    derivedAccount,
  };

  return <DerivedAccountContext.Provider value={value}>{children}</DerivedAccountContext.Provider>;
};

export const useDerivedAccount = () => {
  const derivedAccount = useContext(DerivedAccountContext);
  if (!derivedAccount) {
    throw new Error("useDerivedAccount must be used within a DerivedAccountProvider");
  }
  return derivedAccount;
};

export const useDerivedAccountEncryption = () => {
  const { derivedAccount } = useDerivedAccount();

  const decryptMessage = async (encryptedMessage: any) => {
    if (!derivedAccount) throw new Error("Derived account not initialized");
    const { privateKey } = derivedAccount;

    const decryptedMessage = await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMessage);
    return decryptedMessage;
  };

  return { decryptMessage, derivedAccountReady: !!derivedAccount };
};

export const generateEncryptionClient = (publicKey: `0x${string}`) => {
  // remove leading 0x04
  const strippedPublicKey = publicKey.replace(/^0x04/, "");

  const encryptMessage = async (message: string) => {
    return EthCrypto.encryptWithPublicKey(strippedPublicKey, message);
  };

  return { encryptMessage };
};
