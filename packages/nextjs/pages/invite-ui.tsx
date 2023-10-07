import type { NextPage } from "next";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { CopyButton } from "~~/components/CopyButton";
import { MetaHeader } from "~~/components/MetaHeader";
import { QrCode } from "~~/components/QrCode";

const InvitePage: NextPage = () => {
  return (
    <>
      <MetaHeader title="Beccamose | Invite" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full flex-1">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h2>Scan the QR Code</h2>
          {/* ToDo --> Fix link */}
          <QrCode address="https://www.google.it/" />
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center w-full">
          <h2>Use the invitation link</h2>
          <p className="bg-base-100 rounded-btn p-4 w-full text-center border-2 border-base-300">
            {/* ToDo --> Fix link */}
            https://www.google.it/
          </p>
          <CopyButton text="https://www.google.it/" className="btn btn-primary min-w-[15rem]">
            {copied => (
              <>
                <ClipboardIcon className="h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </>
            )}
          </CopyButton>
        </div>
      </section>
    </>
  );
};

export default InvitePage;
