import { Box, VStack } from '@chakra-ui/react';
import { ChatMessageContainer } from './ChatMessageContainer';
import { useEffect, useRef } from 'react';
import useUserState from '../state/useUserState';

interface Props {
  messages: PublicMessage[] | PrivateMessage[];
  typingUsers: string[];
  setChannel: (channel: string) => void;
}

export const ChatWindow = ({ messages, typingUsers, setChannel }: Props) => {
  const { user } = useUserState();
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, messages.length]);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  const filteredUsers = typingUsers.filter(u => u !== user?.username);

  return (
    <VStack w='100%' h='100%' py='10px' px='20px' overflowY='scroll' ref={chatWindowRef}>
      {messages.length === 0 ? (
        <VStack h='60%' justifyContent='center'>
          <Box color='white' fontSize='4rem'>
            <em>Brak wiadomości</em>
          </Box>
        </VStack>
      ) : (
        <VStack w={'100%'} h={'100%'} justifyContent={'space-between'}>
          <VStack w='100%'>
            {messages.map((m, index) => (
              <ChatMessageContainer
                key={index}
                msg={m}
                prevName={index === 0 ? '' : messages[index - 1].senderName}
                prevTime={index === 0 ? null : messages[index - 1].time}
                setChannel={setChannel}
              />
            ))}
          </VStack>
          <Box color='white'>
            {filteredUsers.join(' ')}{' '}
            {filteredUsers.length > 0 ? (filteredUsers.length === 1 ? ' pisze' : 'piszą') : ''}
          </Box>
        </VStack>
      )}
    </VStack>
  );
};
