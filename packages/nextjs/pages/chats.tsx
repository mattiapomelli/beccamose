import Link from "next/link";
import type { NextPage } from "next";
import { useChats } from "~~/sdk/hooks/useChats";

const ChatsPage: NextPage = () => {
  const { chats } = useChats();

  console.log(chats);

  return (
    <div>
      <h1>Chats</h1>

      <div>
        {chats.map(chat => (
          <Link key={chat.sender} href={`/chat/${chat.sender}`}>
            <div>
              {chat.sender} - {chat.timestamp}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
