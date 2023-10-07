import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

interface ChatType {
  timestamp: string;
  senderPublicKey: string;
  senderAddress: string;
}

const chats: ChatType[] = [
  {
    timestamp: "1111111111",
    senderPublicKey: "senderPublicKey--1",
    senderAddress: "senderAddress--1",
  },
  {
    timestamp: "2222222222",
    senderPublicKey: "senderPublicKey--2",
    senderAddress: "senderAddress--2",
  },
  {
    timestamp: "3333333333",
    senderPublicKey: "senderPublicKey--3",
    senderAddress: "senderAddress--3",
  },
];

const ChatsPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <MetaHeader title="Beccamose | Chats" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full">
        <div className="flex flex-col gap-y-2 items-center justify-center w-full">
          <h1 className="w-full text-left font-semibold text-base mb-2">Active Chats</h1>
          {chats.map(({ timestamp, senderAddress }) => {
            return (
              <div
                key={timestamp}
                onClick={() => router.push(`/chats/${senderAddress}`)}
                className="bg-primary text-primary-content rounded-btn p-4 w-full text-left"
              >
                {senderAddress}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ChatsPage;
