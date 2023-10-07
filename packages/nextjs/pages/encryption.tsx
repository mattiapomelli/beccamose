import EthCrypto from "eth-crypto";
import type { NextPage } from "next";
import { generateEncryptionClient } from "~~/sdk/crypto";

const publicKey =
  "0x0447297d2906a3daab0b4968b16e6fb7600bbe00dc5edec32e215c635fb1a9d308bb2b0b4168fd37d5e1859c8da5a0895552a43b509bd9702ed129b9ba5530fd2c";

const privateKey = "0x3db9f5d5610a89985a292b3c3d4c0deb082c331a18a630d4e05ae53343d74cd7";

const Encryption: NextPage = () => {
  const onEncrypt = async () => {
    const encryptionClient = generateEncryptionClient(publicKey);
    const encryptedMessage = await encryptionClient.encryptMessage(JSON.stringify({ message: "Hello world" }));

    console.log("Encrypted message", encryptedMessage);

    const decryptedMessage = await EthCrypto.decryptWithPrivateKey(privateKey, encryptedMessage);

    console.log("Decrypted message", decryptedMessage);
  };

  return (
    <div>
      <button onClick={onEncrypt}>Encrypt</button>
    </div>
  );
};

export default Encryption;
