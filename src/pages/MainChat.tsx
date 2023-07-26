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
import { NewGroupForm } from '../components/NewGroupForm';
import useCustomPublicChatState from '../state/useCustomPublicState';
import { AddUserToChatForm } from '../components/AddUserToChatForm';

export const MainChat = () => {
  const navigate = useNavigate();
  const { user, setStompUserName } = useUserState();

  if (!user) {
    navigate('/');
    return null;
  }

  const [currentChatWindow, setChatWindow] = useState<string>('Public');
  const [chatWindowView, setChatWindowView] = useState<'messages' | 'users' | 'add-user'>('messages');
  const chatInputRef = useRef<HTMLInputElement>(null);
  const {
    messages,
    publicChatUsers,
    typingUsers: typingUsersPublic,
    input: inputPublic,
    setInput: setInputPublic,
    addPublicMessage,
    setUsers,
    removeUser: removeUserPublic,
  } = usePublicChatState();
  const { privateChats, addMessageToPrivateChat, addPrivateChat, userLeavePriv } = usePrivateMessagesState();
  const { customPublicChats, addCustomPublicChat, addMessageToCustomPublicChat, userLeaveCustomPublicChat } =
    useCustomPublicChatState();
  const [refresh, setRefresh] = useState(false);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const { webSocketClient, subscribeToCustomPublicChat } = useWebSocket(
    user!.username,
    user!.jwtToken,
    setStompUserName,
    handlePublicMessage,
    handlePrivMessage
  );

  const [newGroupRequest, setNewGroupRequest] = useState('');

  function handlePublicMessage(m: any) {
    const msg = JSON.parse(m.body);
    if (msg.type === 'SYSTEM' && msg.senderName === 'SYSTEM-JOIN') {
      setUsers(msg.message);
    } else if (msg.type === 'SYSTEM' && msg.senderName === 'SYSTEM-LEAVE') {
      removeUserPublic(msg.message);
      userLeavePriv(msg.message);
    } else {
      addPublicMessage(msg);
    }
  }

  function handlePrivMessage(m: any) {
    const msg = JSON.parse(m.body);
    if (msg.type === 'SYSTEM' && msg.senderName === 'CUSTOM-CHAT-JOIN') {
      const chatRoomName = msg.message;
      setNewGroupRequest(chatRoomName)
    } else {
      addMessageToPrivateChat(JSON.parse(m.body));
    }
  }

  useEffect(() => {
    if (webSocketClient) {
      setIsSocketInitialized(true);
    }
  }, [webSocketClient]);

  useEffect(() => {
    if(newGroupRequest) {
      handleCreateNewGroupChat(newGroupRequest);
      setNewGroupRequest('')
    }
  }, [newGroupRequest])

  if (!isSocketInitialized) return <div>LOADING</div>;

  const headers = {
    Authorization: 'Bearer ' + user!.jwtToken,
  };

  const handleSendMessage = (message: PublicMessageRaw) => {
    if (currentChatWindow === 'Public') {
      webSocketClient!.publish({ destination: '/websocket/global', headers, body: JSON.stringify(message) });
    } else if (currentChatWindow.includes('custom')) {
      webSocketClient!.publish({
        destination: `/websocket/global/${currentChatWindow}`,
        headers,
        body: JSON.stringify(message),
      });
    } else {
      webSocketClient!.publish({ destination: '/websocket/priv', headers, body: JSON.stringify(message) });
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

  const handleCreateNewGroupChat = (groupName: string) => {
    addCustomPublicChat(groupName);
    setChatWindow(groupName);
    subscribeToCustomPublicChat(groupName, (m: any) => {
      const msg = JSON.parse(m.body);
      console.log(msg);
      if (msg.type === 'SYSTEM' && msg.senderName === 'SYSTEM-JOIN') {
        customPublicChats.get(groupName)?.joinUser(user.username, user.username);
      }
      addMessageToCustomPublicChat(groupName, msg);
      setRefresh(state => !state);
    });
  };

  const handleAddUserToCustomChat = (stompUsername: string) => {
    const msg: PrivateMessageRaw = {
      type: 'SYSTEM',
      senderName: 'CUSTOM-CHAT-JOIN',
      senderStompName: 'CUSTOM-CHAT-JOIN',
      receiverStompName: stompUsername,
      message: currentChatWindow,
    };
    webSocketClient!.publish({ destination: '/websocket/priv', headers, body: JSON.stringify(msg) });
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
          {currentChatWindow === 'new-custom' && <NewGroupForm onCreateNewGroup={handleCreateNewGroupChat} />}
          {currentChatWindow != 'new-custom' && (
            <ChatWindowHeader
              currentChatWindow={currentChatWindow}
              chatWindowView={chatWindowView}
              publicChatUsers={
                currentChatWindow === 'Public'
                  ? publicChatUsers.length
                  : customPublicChats.get(currentChatWindow)?.customChatUsers.length || 0
              }
              setChatWindowView={setChatWindowView}
            />
          )}
          {currentChatWindow != 'new-custom' && chatWindowView === 'users' && (
            <PublicUsersList
              publicChatUsers={
                currentChatWindow === 'Public'
                  ? publicChatUsers
                  : customPublicChats.get(currentChatWindow)?.customChatUsers || []
              }
              addPrivateChat={handleSelectUserFromList}
            />
          )}
          {currentChatWindow != 'new-custom' && chatWindowView === 'messages' && (
            <>
              <ChatWindow
                messages={
                  currentChatWindow === 'Public'
                    ? messages
                    : currentChatWindow.includes('custom')
                    ? customPublicChats.get(currentChatWindow)?.messages || []
                    : privateChats.get(currentChatWindow)?.privateMessages || []
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
          {currentChatWindow != 'new-custom' && chatWindowView === 'add-user' && (
            <AddUserToChatForm currentChannel={currentChatWindow} addToChat={handleAddUserToCustomChat} />
          )}
        </VStack>
      </HStack>
    </VStack>
  );
};
