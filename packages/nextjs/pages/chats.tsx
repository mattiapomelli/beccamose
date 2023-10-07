import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useChats } from "~~/sdk/hooks/useChats";

const ChatsPage: NextPage = () => {
  const { chats } = useChats();
  const router = useRouter();

  return (
    <>
      {/* <h1>Chats</h1>

      <div>
        {chats?.map(chat => (
          <Link key={chat.senderPublicKey} href={`/chat/${chat.senderPublicKey}`}>
            <div>
              {chat.senderAddress} - {chat.timestamp}
            </div>
          </Link>
        ))}
      </div> */}

      <MetaHeader title="Beccamose | Chats" />

      <section className="flex flex-col gap-y-4 items-center justify-center w-full">
        <div className="flex flex-col gap-y-2 items-center justify-center w-full">
          <h1 className="w-full text-left font-semibold text-base mb-2">Active Chats</h1>
          {chats?.map(chat => {
            return (
              <Link
                key={chat.senderPublicKey}
                href={`/chat/${chat.senderPublicKey}`}
                onClick={() => router.push(`/chats/${chat.senderAddress}`)}
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
