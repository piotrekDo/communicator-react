import { User } from '../model/User';
import { Button, FormControl, HStack, Input } from '@chakra-ui/react';
import usePrivateMessagesState from '../state/usePrivateMessagesState';
import { FormEvent, useEffect, useState } from 'react';

interface Props {
  user: User;
  chatWindow: string;
  inputField: string;
  inputRef: React.RefObject<HTMLInputElement>;
  publish: (message: PublicMessageRaw | PrivateMessageRaw) => void;
}

export const ChatSendMessageForm = ({ user, chatWindow, inputField, inputRef, publish }: Props) => {
  const { addMessageToPrivateChat } = usePrivateMessagesState();
  const [input, setInput] = useState('');
  const [typingStatus, setTypingStatus] = useState<'ilde' | 'typing'>('ilde');

  useEffect(() => {
    setInput(inputField);
    if (inputField !== '') setTypingStatus('typing');
    else setTypingStatus('ilde');
  }, [chatWindow]);

  useEffect(() => {
    if (!user || !user.stompUsername) return;
    if (input !== '' && typingStatus === 'ilde') {
      const message = {
        type: 'SYSTEM',
        senderName: user.username,
        senderStompName: user.stompUsername,
        receiverStompName: chatWindow,
        message: 'typing-start',
      };
      setTypingStatus('typing');
      publish(message);
    }
    if (input === '' && typingStatus === 'typing') {
      const systemMessage = {
        type: 'SYSTEM',
        senderName: user.username,
        senderStompName: user.stompUsername,
        receiverStompName: chatWindow,
        message: 'typing-stop',
      };
      setTypingStatus('ilde');
      publish(systemMessage);
    }
  }, [input]);

  const handleSubmitMessage = (data: string) => {
    if (!user || !user.stompUsername) return;
    if (!publish) {
      console.error('socket.publish is undefined.');
      return;
    }
    let message;
    if (chatWindow === 'Public' || chatWindow.includes('custom')) {
      message = {
        senderName: user.username,
        senderStompName: user.stompUsername,
        message: data,
      };
    } else {
      message = {
        senderName: user.username,
        senderStompName: user.stompUsername,
        receiverStompName: chatWindow,
        message: data,
      };
      addMessageToPrivateChat(message);
    }

    const systemMessage = {
      type: 'SYSTEM',
      senderName: user.username,
      senderStompName: user.stompUsername,
      receiverStompName: chatWindow,
      message: 'typing-stop',
    };
    setTypingStatus('ilde');
    publish(message);
    publish(systemMessage);
  };

  const handleFormSubmit = (data: FormEvent<HTMLFormElement>) => {
    data.preventDefault();
    if (input.trim() !== '') {
      handleSubmitMessage(input);
    }
    setInput('');
  };

  return (
    <form onSubmit={e => handleFormSubmit(e)}>
      <HStack
        bg={'blackAlpha.700'}
        color={'white'}
        w={'100%'}
        h={'50px'}
        border={'3px solid white'}
        borderRadius={'30px'}
      >
        <FormControl
          _focus={{
            border: 'none',
          }}
          w={'90%'}
          h={'100%'}
          mx={0}
        >
          <Input
            _focus={{
              border: 'none',
            }}
            border={'none'}
            bg={'blackAlpha.700'}
            w={'100%'}
            h={'100%'}
            px={'15px'}
            borderRadius={'30px 0 0 30px'}
            type='text'
            placeholder='Wiadomość'
            value={input}
            onChange={e => setInput(e.target.value)}
            ref={inputRef}
          />
        </FormControl>
        {input !== '' && (
          <Button type='submit' h={'100%'} w={'120px'} mx={0} borderRadius={'0 30px 30px 0'} color={'white'}>
            Wyślij
          </Button>
        )}
      </HStack>
    </form>
  );
};
