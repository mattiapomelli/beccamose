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
          <div key={chat.sender}>
            {chat.sender} - {chat.timestamp}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
