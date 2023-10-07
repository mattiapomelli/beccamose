import { useEffect, useMemo, useRef, useState } from "react";
import type { Options } from "qr-code-styling";
import QRCodeStyling from "qr-code-styling";
import { useDarkMode } from "usehooks-ts";

export const QrCode = ({ address }: { address: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [qrCode, setQRCode] = useState<QRCodeStyling | null>(null);
  const { isDarkMode } = useDarkMode();

  const options: Options = useMemo(() => {
    return {
      width: 300,
      height: 300,
      type: "svg",
      data: address,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "Q",
      },
      backgroundOptions: {
        color: "#00000000",
      },
      dotsOptions: {
        color: isDarkMode ? "#fff" : "#000",
        type: "rounded",
      },
      cornersSquareOptions: {
        color: isDarkMode ? "#fff" : "#000",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: isDarkMode ? "#fff" : "#000",
        type: "dot",
      },
    };
  }, [address, isDarkMode]);

  useEffect(() => {
    const createQRCodeInstance = async () => {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      setQRCode(new QRCodeStyling(options));
    };

    createQRCodeInstance();
  }, [options]);

  useEffect(() => {
    if (ref.current && qrCode) qrCode.append(ref.current);
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  return <div ref={ref} />;
};
