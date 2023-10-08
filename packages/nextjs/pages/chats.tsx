import Link from "next/link";
// import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useStoredChats } from "~~/sdk-new/hooks/useStoredChats";

const ChatsPage: NextPage = () => {
  const { data: chats } = useStoredChats();

  return (
    <>
      <MetaHeader title="Beccamose | Chats" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full">
        <div className="flex flex-col gap-y-2 items-center justify-center w-full">
          <h1 className="w-full text-left font-semibold text-base mb-2">Active Chats</h1>
          {chats?.map(chat => {
            return (
              <Link
                key={chat.senderPublicKey}
                href={`/chat/${chat.senderPublicKey}`}
                className="bg-primary text-primary-content rounded-btn p-4 w-full text-left"
              >
                {chat.senderAddress}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ChatsPage;
