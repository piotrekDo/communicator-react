import { VStack } from '@chakra-ui/react';
import { ChatMessageContainer } from './ChatMessageContainer';
import { useEffect, useRef } from 'react';

interface Props {
  messages: PublicMessage[];
}

export const ChatWindow = ({ messages }: Props) => {
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
      {messages.length > 0 &&
        messages.map((m, index, tab) => (
          <ChatMessageContainer
            key={index}
            msg={m}
            prevName={index === 0 ? '' : tab[index - 1].senderName}
            prevTime={index === 0 ? null : tab[index - 1].time}
          />
        ))}
    </VStack>
  );
};
