import { Box, HStack, VStack } from '@chakra-ui/react';
import useUserState from '../state/useUserState';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import useWebSocket from '../hook/useWebSocket';
import usePublicChatState from '../state/usePublicChatState';
import { useEffect, useRef, useState } from 'react';
import { ChatSendMessageForm } from '../components/ChatSendMessageForm';
import { ChatWindow } from '../components/ChatWindow';
import { ChatChannelList } from '../components/ChatChannelList';
import usePrivateMessagesState from '../state/usePrivateMessagesState';
import { ChatWindowHeader } from '../components/ChatWindowHeader';
import { PublicUsersList } from '../components/PublicUsersList';

export const MainChat = () => {
  const navigate = useNavigate();
  const { user, setStompUserName } = useUserState();
  const [currentChatWindow, setChatWindow] = useState<string>('Public');
  const [chatWindowView, setChatWindowView] = useState<'messages' | 'users'>('messages');
  const chatInputRef = useRef<HTMLInputElement>(null);
  const {
    messages,
    publicChatUsers,
    typingUsers: typingUsersPublic,
    input: inputPublic,
    setInput: setInputPublic,
    addPublicMessage,
    setUsers,
    removeUser,
  } = usePublicChatState();
  const { privateChats, addMessageToPrivateChat, addPrivateChat } = usePrivateMessagesState();
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  const socket = useWebSocket(
    user!.username,
    user!.jwtToken,
    setStompUserName,
    (m: any) => {
      const msg = JSON.parse(m.body);
      console.log(msg);
      if (msg.type === 'SYSTEM' && msg.senderName === 'SYSTEM-JOIN') {
        setUsers(msg.message);
      } else if (msg.type === 'SYSTEM' && msg.senderName === 'SYSTEM-LEAVE') {
        removeUser(msg.message);
      } else {
        addPublicMessage(msg);
      }
    },
    (m: any) => {
      const msg = JSON.parse(m.body);
      console.log(msg);
      addMessageToPrivateChat(JSON.parse(m.body));
    }
  );

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

  const handleSendMessage = (message: PublicMessageRaw) => {
    const headers = {
      Authorization: 'Bearer ' + user!.jwtToken,
    };
    if (currentChatWindow === 'Public') {
      socket!.publish({ destination: '/websocket/global', headers, body: JSON.stringify(message) });
    } else {
      socket!.publish({ destination: '/websocket/priv', headers, body: JSON.stringify(message) });
    }
  };

  const handleSwitchChannel = (channelName: string) => {
    if (currentChatWindow === 'Public') {
      setInputPublic(chatInputRef.current?.value || '');
    } else {
      privateChats.get(currentChatWindow)?.setInput(chatInputRef.current?.value || '');
    }
    setChatWindow(channelName);
    setChatWindowView('messages');
  };

  const handleSelectUserFromList = (stomp: string, name: string) => {
    addPrivateChat(stomp, name);
    setChatWindow(stomp);
    setChatWindowView('messages');
  };

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
        <ChatChannelList setChannel={handleSwitchChannel} currentChatWindow={currentChatWindow} />
        <VStack bg={'blackAlpha.900'} w={'90%'} h={'100%'} borderRadius={'20px'} p={'20px'}>
          <ChatWindowHeader
            currentChatWindow={currentChatWindow}
            chatWindowView={chatWindowView}
            publicChatUsers={publicChatUsers.length}
            setChatWindowView={setChatWindowView}
          />
          {chatWindowView === 'users' && (
            <PublicUsersList publicChatUsers={publicChatUsers} addPrivateChat={handleSelectUserFromList} />
          )}
          {chatWindowView === 'messages' && (
            <>
              <ChatWindow
                messages={
                  currentChatWindow === 'Public' ? messages : privateChats.get(currentChatWindow)?.privateMessages || []
                }
                typingUsers={
                  currentChatWindow === 'Public'
                    ? typingUsersPublic
                    : privateChats.get(currentChatWindow)?.typingUsers || []
                }
                setChannel={setChatWindow}
              />
              <Box w={'100%'} borderRadius={'30px'}>
                <ChatSendMessageForm
                  user={user}
                  publish={handleSendMessage}
                  chatWindow={currentChatWindow}
                  inputField={
                    currentChatWindow === 'Public' ? inputPublic : privateChats.get(currentChatWindow)?.input || ''
                  }
                  inputRef={chatInputRef}
                />
              </Box>
            </>
          )}
        </VStack>
      </HStack>
    </VStack>
  );
};
