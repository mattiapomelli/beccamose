import { createContext, useContext, useState } from "react";
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
  derivedAccount: DerivedAccount | null;
  setDerivedAccount: (derivedAccount: DerivedAccount) => void;
}

const DerivedAccountContext = createContext<DerivedAccountContextType | null>(null);

export const DerivedAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [derivedAccount, setDerivedAccount] = useState<DerivedAccount | null>(null);

  const value = {
    derivedAccount,
    setDerivedAccount,
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
  const { derivedAccount, setDerivedAccount } = useDerivedAccount();
  const { data: walletClient, isSuccess: isWalletClientLoaded } = useWalletClient();

  const getDerivedAccount = async () => {
    if (derivedAccount) return derivedAccount;

    if (!walletClient) throw new Error("Wallet client not initialized");

    const _derivedAccount = await generateDerivedAccount(walletClient);
    setDerivedAccount(_derivedAccount);
    return _derivedAccount;
  };

  const decryptMessage = async (encryptedMessage: any) => {
    const { privateKey } = await getDerivedAccount();
    // console.log("Decrypting with private key: ", privateKey);

    const decryptedMessage = await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMessage);
    return decryptedMessage;
  };

  return { getDerivedAccount, decryptMessage, isWalletClientLoaded };
};

export const generateEncryptionClient = (publicKey: `0x${string}`) => {
  // remove leading 0x04
  const strippedPublicKey = publicKey.replace(/^0x04/, "");

  const encryptMessage = async (message: string) => {
    return EthCrypto.encryptWithPublicKey(strippedPublicKey, message);
  };

  return { encryptMessage };
};
