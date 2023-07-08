import { VStack } from '@chakra-ui/react';
import { ChatChannelContainer } from './ChatChannelContainer';
import usePrivateMessagesState from '../state/usePrivateMessagesState';

interface Props {
  setChannel: (channel: string) => void;
  currentChatWindow: string;
}

export const ChatChannelList = ({ setChannel, currentChatWindow }: Props) => {
  const { privateChats } = usePrivateMessagesState();
  console.log(privateChats)
  return (
    <VStack w={'300px'} h={'100%'} borderRadius={'20px 0 0 20px'}>
      <ChatChannelContainer
        stompUsername='Public'
        username='Public'
        setChannel={setChannel}
        currentChatWindow={'Public' === currentChatWindow}
      />
      {privateChats.map(chat => (
        <ChatChannelContainer
          key={chat.stompUsername}
          stompUsername={chat.stompUsername}
          username={chat.username}
          setChannel={setChannel}
          currentChatWindow={chat.stompUsername === currentChatWindow}
        />
      ))}
    </VStack>
  );
};
