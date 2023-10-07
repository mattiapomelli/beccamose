import Link from "next/link";
import type { NextPage } from "next";
import { useChats } from "~~/sdk/hooks/useChats";

const ChatsPage: NextPage = () => {
  const { chats } = useChats();

  return (
    <div>
      <h1>Chats</h1>

      <div>
        {chats?.map(chat => (
          <Link key={chat.senderPublicKey} href={`/chat/${chat.senderPublicKey}`}>
            <div>
              {chat.senderAddress} - {chat.timestamp}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
