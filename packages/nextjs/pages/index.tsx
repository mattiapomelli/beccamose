import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { Button } from "~~/components/ui/Button";
import { useStoredChats } from "~~/sdk-new/hooks/useStoredChats";

const ChatsPage: NextPage = () => {
  const { data: chats } = useStoredChats();

  console.log("CHATS: ", chats);

  return (
    <>
      <MetaHeader title="Beccamose | Chats" />

      <section>
        <div className="flex justify-between gap-4 items-center">
          <h1 className="w-full font-bold text-lg text-base-content">Active Location Sharings</h1>
          <Link href={"/invite"}>
            <Button className="whitespace-nowrap">New Sharing</Button>
          </Link>
        </div>
        {(!chats || chats?.length === 0) && (
          <div className="flex justify-center py-20 text-base-content">
            <p>You have no active location sharings.</p>
          </div>
        )}
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
      </section>
    </>
  );
};

export default ChatsPage;
