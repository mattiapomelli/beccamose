import Link from "next/link";
import type { NextPage } from "next";
import Blockies from "react-blockies";
import { MetaHeader } from "~~/components/MetaHeader";
import { Button } from "~~/components/ui/Button";
import { useChats } from "~~/sdk/hooks/useChats";

const ChatsPage: NextPage = () => {
  const { chats } = useChats();

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
        <div className="mt-6">
          {chats?.map(chat => {
            return (
              <Link key={chat.senderPublicKey} href={`/chat/${chat.senderPublicKey}`}>
                <div className="bg-base-300 rounded-lg p-4 flex items-center gap-3">
                  <Blockies className="rounded-full" size={10} seed={chat.senderAddress} scale={3} />

                  <span className="font-medium text-lg">{chat.senderAddress}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ChatsPage;
