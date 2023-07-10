import { Box, VStack } from '@chakra-ui/react';
import { ChatMessageContainer } from './ChatMessageContainer';
import { useEffect, useRef } from 'react';

interface Props {
  messages: PublicMessage[] | PrivateMessage[];
  setChannel: (channel: string) => void;
}

export const ChatWindow = ({ messages, setChannel }: Props) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      handleScroll();
    }, 1);
  }, [messages]);

  const handleScroll = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };
  return (
    <VStack w={'100%'} h={'100%'} overflowY={'scroll'} ref={chatWindowRef}>
      {messages.length === 0 && (<VStack h={'60%'} justifyContent={'center'}>
        <Box color={'white'} fontSize={'4rem'}><em>Brak wiadomości</em></Box>
      </VStack>)}
      {messages.length > 0 &&
        messages.map((m, index, tab) => (
          <ChatMessageContainer
            key={index}
            msg={m}
            prevName={index === 0 ? '' : tab[index - 1].senderName}
            prevTime={index === 0 ? null : tab[index - 1].time}
            setChannel={setChannel}
          />
        ))}
    </VStack>
  );
};
