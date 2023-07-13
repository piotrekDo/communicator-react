import { useForm, useWatch } from 'react-hook-form';
import { User } from '../model/User';
import { Button, FormControl, HStack, Input } from '@chakra-ui/react';
import usePrivateMessagesState from '../state/usePrivateMessagesState';
import { useEffect, useState } from 'react';

interface Props {
  user: User;
  chatWindow: string;
  publish: (message: PublicMessageRaw | PrivateMessageRaw) => void;
}
interface FormData {
  message: string;
}

export const ChatSendMessageForm = ({ user, chatWindow, publish }: Props) => {
  const { addMessageToPrivateChat } = usePrivateMessagesState();
  const { register, handleSubmit, reset, control } = useForm<FormData>();
  const messageValue = useWatch({
    control,
    name: 'message',
    defaultValue: '',
  });
  const [typingStatus, setTypingStatus] = useState<'ilde' | 'typing'>('ilde');

  useEffect(() => {
    if (!user || !user.stompUsername) return;
    if (messageValue !== '' && typingStatus === 'ilde') {
      const message = {
        type: 'SYSTEM',
        senderName: user.username,
        senderStompName: user.stompUsername,
        message: 'typing-start',
      };
      setTypingStatus('typing');
      publish(message);
    }
    if (messageValue === '' && typingStatus === 'typing') {
      const systemMessage = {
        type: 'SYSTEM',
        senderName: user.username,
        senderStompName: user.stompUsername,
        message: 'typing-stop',
      };
      setTypingStatus('ilde');
      publish(systemMessage);
    }
  }, [messageValue]);

  const handleSubmitPublicMessage = (data: FormData) => {
    if (!user || !user.stompUsername) return;
    if (!publish) {
      console.error('socket.publish jest niezdefiniowane.');
      return;
    }
    let message;
    if (chatWindow === 'Public') {
      message = {
        senderName: user.username,
        senderStompName: user.stompUsername,
        message: data.message,
      };
    } else {
      message = {
        senderName: user.username,
        senderStompName: user.stompUsername,
        receiverStompName: chatWindow,
        message: data.message,
      };
      addMessageToPrivateChat(message);
    }

    const systemMessage = {
      type: 'SYSTEM',
      senderName: user.username,
      senderStompName: user.stompUsername,
      message: 'typing-stop',
    };
    setTypingStatus('ilde');
    publish(message);
    publish(systemMessage);
  };

  const handleFormSubmit = (data: FormData) => {
    if (data.message.trim() !== '') {
      handleSubmitPublicMessage(data);
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            {...register('message')}
          />
        </FormControl>
        {messageValue !== '' && (
          <Button type='submit' h={'100%'} w={'120px'} mx={0} borderRadius={'0 30px 30px 0'} color={'white'}>
            Wyślij
          </Button>
        )}
      </HStack>
    </form>
  );
};
