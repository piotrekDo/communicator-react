import { Box, Button, FormControl, HStack, Input, VStack } from '@chakra-ui/react';
import useUserState from '../state/useUserState';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import useWebSocket from '../hook/useWebSocket';
import { useForm } from 'react-hook-form';
import usePublicChatState from '../state/usePublicChatState';
import { ChatMessageContainer } from '../components/ChatMessageContainer';
import { useEffect, useRef } from 'react';

interface FormData {
  message: string;
}

export const MainChat = () => {
  const navigate = useNavigate();
  const { user, setStompUserName } = useUserState();
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const { messages, addPublicMessage } = usePublicChatState();

  const socket = useWebSocket(user!.username, setStompUserName, (m: any) => addPublicMessage(JSON.parse(m.body)));

  if (!user) {
    navigate('/');
    return null;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handleSubmitPublicMessage = (data: FormData) => {
    if (!user) return;
    const message = {
      senderName: user.username,
      senderStompName: user.stompUsername,
      message: data.message,
    };
    socket!.publish({ destination: '/websocket/global', body: JSON.stringify(message) });
  };

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
    <VStack bg={'linkedin.400'} w={'100vw'} h={'100vh'}>
      <Navbar />
      <HStack p={'20px'} w={'100%'} h={'100%'}>
        <VStack bg={'blackAlpha.400'} w={'300px'} h={'100%'} borderRadius={'20px 0 0 20px'}></VStack>
        <VStack bg={'blackAlpha.400'} w={'90%'} h={'100%'} borderRadius={'0 20px 20px 0'} p={'20px'}>
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
          <Box w={'100%'} borderRadius={'30px'}>
            <form
              onSubmit={handleSubmit(data => {
                handleSubmitPublicMessage(data);
                reset();
              })}
            >
              <HStack bg={'green.500'} w={'100%'} h={'50px'} borderRadius={'30px'}>
                <FormControl w={'90%'} h={'100%'}>
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
                <Button type='submit' h={'100%'} borderRadius={'30px'} color={'white'}>
                  Submit
                </Button>
              </HStack>
            </form>
          </Box>
        </VStack>
      </HStack>
    </VStack>
  );
};
