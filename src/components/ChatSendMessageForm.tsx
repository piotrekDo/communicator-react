import { useForm } from 'react-hook-form';
import { User } from '../model/User';
import { Button, FormControl, HStack, Input } from '@chakra-ui/react';
import usePrivateMessagesState from '../state/usePrivateMessagesState';

interface Props {
  user: User;
  chatWindow: string;
  publish: (message: PublicMessageRaw | PrivateMessageRaw) => void;
}

export const ChatSendMessageForm = ({ user, chatWindow, publish }: Props) => {
  const {addMessageToPrivateChat} = usePrivateMessagesState();
  interface FormData {
    message: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handleSubmitPublicMessage = (data: FormData) => {
    if (!user || !user.stompUsername) return;
    if (!publish) {
      console.error('socket.publish is undefined.');
      return;
    }
    let message;
    if(chatWindow === 'Public') {
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
      }
      addMessageToPrivateChat(message);
    }

    publish(message);
  };

  return (
    <form
      onSubmit={handleSubmit(data => {
        handleSubmitPublicMessage(data);
        reset();
      })}
    >
              <HStack w={'100%'} h={'50px'} borderRadius={'30px'}>
                <FormControl w={'90%'} h={'100%'} mx={0}>
                  <Input
                    w={'100%'}
                    h={'100%'}
                    px={'15px'}
                    borderRadius={'30px 0 0 30px'}
                    type='text'
                    placeholder='message'
                    {...register('message')}
                  />
                </FormControl>
                <Button
                  bg={'green.500'}
                  type='submit'
                  h={'100%'}
                  w={'120px'}
                  mx={0}
                  borderRadius={'0 30px 30px 0'}
                  color={'white'}
                >
                  Submit
                </Button>
              </HStack>
    </form>
  );
};
