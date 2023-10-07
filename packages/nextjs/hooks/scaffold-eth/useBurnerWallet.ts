import { secp256k1 } from "@noble/curves/secp256k1";
import { useLocalStorage } from "usehooks-ts";
import { Hex, toHex } from "viem";
import { generatePrivateKey } from "viem/accounts";

const burnerStorageKey = "scaffoldEth2.burnerWallet.sk";

const isValidSk = (pk: Hex | string | undefined | null): boolean => {
  return pk?.length === 64 || pk?.length === 66;
};

const newDefaultPrivateKey = generatePrivateKey();

export const saveBurnerSK = (privateKey: { sk: Hex }): void => {
  if (typeof window != "undefined" && window != null) {
    window?.localStorage?.setItem(burnerStorageKey, JSON.stringify(privateKey));
  }
};

export const loadBurnerSK = (): { sk: Hex } => {
  let currentSk: Hex = "0x";

  if (typeof window != "undefined" && window != null) {
    try {
      const skFromLocalStorage = JSON.parse(window?.localStorage?.getItem?.(burnerStorageKey) ?? "{}");
      if (!!skFromLocalStorage && isValidSk(skFromLocalStorage.sk)) {
        currentSk = skFromLocalStorage.sk;
      }
    } catch (e) {
      currentSk = "0x";
    }
  }

  if (!!currentSk && isValidSk(currentSk)) {
    return { sk: currentSk };
  } else {
    saveBurnerSK({ sk: newDefaultPrivateKey });
    return { sk: newDefaultPrivateKey };
  }
};

export type TBurnerSigner = {
  privateKey: Hex;
  publicKey: Hex | undefined;
};

export const useBurnerWallet = (): TBurnerSigner => {
  const [burnerSk] = useLocalStorage<{ sk: Hex }>(burnerStorageKey, { sk: newDefaultPrivateKey });

  const publicKey = toHex(secp256k1.getPublicKey(burnerSk.sk.slice(2), false));

  return {
    privateKey: burnerSk.sk,
    publicKey,
  };
};
