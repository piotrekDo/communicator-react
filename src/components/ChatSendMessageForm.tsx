import { useForm } from 'react-hook-form';
import { User } from '../model/User';
import { Button, FormControl, HStack, Input } from '@chakra-ui/react';
import usePrivateMessagesState from '../state/usePrivateMessagesState';
import { useState } from 'react';

interface Props {
  user: User;
  chatWindow: string;
  publish: (message: PublicMessageRaw | PrivateMessageRaw) => void;
}



export const ChatSendMessageForm = ({ user, chatWindow, publish }: Props) => {
  const { addMessageToPrivateChat } = usePrivateMessagesState();
  const [formInput, setFormInput] = useState<string>('');

  interface FormData {
    message: string;
  }
  const { register, handleSubmit, reset } = useForm<FormData>();

  const handleSubmitPublicMessage = (data: FormData) => {
    if (!user || !user.stompUsername) return;
    if (!publish) {
      console.error('socket.publish is undefined.');
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
console.log(message)
    publish(message);
  };

  return (
    <form
      onSubmit={handleSubmit(data => {
        handleSubmitPublicMessage(data);
        reset();
      })}
    >
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
            placeholder='message'
            {...(register('message'))}
          />
        </FormControl>
        {formInput == '' && (
          <Button type='submit' h={'100%'} w={'120px'} mx={0} borderRadius={'0 30px 30px 0'} color={'white'}>
            Submit
          </Button>
        )}
      </HStack>
    </form>
  );
};
