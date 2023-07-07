import { Box, HStack, VStack } from '@chakra-ui/react';
import useUserState from '../state/useUserState';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import useWebSocket from '../hook/useWebSocket';
import usePublicChatState from '../state/usePublicChatState';
import { useEffect, useState } from 'react';
import { ChatSendMessageForm } from '../components/ChatSendMessageForm';
import { ChatWindow } from '../components/ChatWindow';

export const MainChat = () => {
  const navigate = useNavigate();
  const { user, setStompUserName } = useUserState();
  const { messages, addPublicMessage } = usePublicChatState();
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  const socket = useWebSocket(user!.username, setStompUserName, (m: any) => addPublicMessage(JSON.parse(m.body)));
  const handleSendPublicMessage = (message: PublicMessageRaw) => {
    socket!.publish({ destination: '/websocket/global', body: JSON.stringify(message) });
  };

  if (!user) {
    navigate('/');
    return null;
  }
  useEffect(() => {
    if (socket) {
      setIsSocketInitialized(true);
    }
  }, [socket]);

  if (!isSocketInitialized) return <div>LOADING</div>;

  return (
    <VStack bg={'linkedin.400'} w={'100vw'} h={'100vh'}>
      <Navbar />
      <HStack
        p={'20px'}
        width={{
          lg: '1400px',
          md: '1000px',
        }}
        h={'90%'}
      >
        <VStack bg={'blackAlpha.400'} w={'300px'} h={'100%'} borderRadius={'20px 0 0 20px'}>
          <Box>dsadsa</Box>
        </VStack>
        <VStack bg={'blackAlpha.400'} w={'90%'} h={'100%'} borderRadius={'0 20px 20px 0'} p={'20px'}>
          <ChatWindow messages={messages} />
          <Box w={'100%'} borderRadius={'30px'}>
            <ChatSendMessageForm user={user} publish={handleSendPublicMessage} />
          </Box>
        </VStack>
      </HStack>
    </VStack>
  );
};
