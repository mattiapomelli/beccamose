import EthCrypto from "eth-crypto";
import { hashMessage } from "viem";
import { recoverPublicKey } from "viem";
import { useBurnerWallet } from "~~/hooks/scaffold-eth";

export const useDecrypt = () => {
  const { privateKey } = useBurnerWallet();

  const decryptMessage = async (encryptedMessage: any) => {
    const decryptedMessage = await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMessage);
    return decryptedMessage;
  };

  return { decryptMessage };
};

export const recoverPublicKeyFromMessageAndSignature = async (message: string, signature: `0x${string}`) => {
  return recoverPublicKey({ hash: hashMessage(message), signature });
};

export const generateEncryptionClient = (publicKey: `0x${string}`) => {
  // remove leading 0x04
  const strippedPublicKey = publicKey.replace(/^0x04/, "");

  const encryptMessage = async (message: string) => {
    return EthCrypto.encryptWithPublicKey(strippedPublicKey, message);
  };

  return { encryptMessage };
};
