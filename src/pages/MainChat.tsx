import { Box, HStack, VStack } from '@chakra-ui/react';
import useUserState from '../state/useUserState';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import useWebSocket from '../hook/useWebSocket';
import usePublicChatState from '../state/usePublicChatState';
import { useEffect, useState } from 'react';
import { ChatSendMessageForm } from '../components/ChatSendMessageForm';
import { ChatWindow } from '../components/ChatWindow';
import { ChatChannelList } from '../components/ChatChannelList';
import usePrivateMessagesState from '../state/usePrivateMessagesState';

export const MainChat = () => {
  const navigate = useNavigate();
  const { user, setStompUserName } = useUserState();
  const [chatWindow, setChatWindow] = useState<string>('Public');
  const { messages, typingUsers: typingUsersPublic, addPublicMessage } = usePublicChatState();
  const { privateChats, addMessageToPrivateChat } = usePrivateMessagesState();
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  const socket = useWebSocket(
    user!.username,
    user!.jwtToken,
    setStompUserName,
    (m: any) => {
      const msg = JSON.parse(m.body);
      console.log(msg);
      addPublicMessage(msg);
    },
    (m: any) => {
      addMessageToPrivateChat(JSON.parse(m.body));
    }
  );
  const handleSendMessage = (message: PublicMessageRaw) => {
    const headers = {
      Authorization: 'Bearer ' + user!.jwtToken,
    };
    if (chatWindow === 'Public') {
      socket!.publish({ destination: '/websocket/global', headers, body: JSON.stringify(message) });
    } else {
      socket!.publish({ destination: '/websocket/priv', headers, body: JSON.stringify(message) });
    }
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
    <VStack bg={'blackAlpha.800'} w={'100vw'} h={'100vh'}>
      <Navbar />
      <HStack
        p={'20px'}
        width={{
          lg: '1400px',
          md: '1000px',
        }}
        h={'90%'}
      >
        <ChatChannelList setChannel={setChatWindow} currentChatWindow={chatWindow} />
        <VStack bg={'blackAlpha.900'} w={'90%'} h={'100%'} borderRadius={'20px'} p={'20px'}>
          <ChatWindow
            messages={
              chatWindow === 'Public'
                ? messages
                : privateChats.find(chat => chat.stompUsername === chatWindow)?.privateMessages || []
            }
            typingUsers={chatWindow === 'Public' ? typingUsersPublic : []}
            setChannel={setChatWindow}
          />
          <Box w={'100%'} borderRadius={'30px'}>
            <ChatSendMessageForm user={user} publish={handleSendMessage} chatWindow={chatWindow} />
          </Box>
        </VStack>
      </HStack>
    </VStack>
  );
};
