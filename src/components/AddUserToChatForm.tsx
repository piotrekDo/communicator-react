import { Button, HStack, Box, VStack } from '@chakra-ui/react';
import usePublicChatState from '../state/usePublicChatState';
import useUserState from '../state/useUserState';
import useCustomPublicChatState from '../state/useCustomPublicState';

interface Props {
  currentChannel: string;
  addToChat: (stompUserName: string) => void;
}

export const AddUserToChatForm = ({ currentChannel, addToChat }: Props) => {
  const { publicChatUsers } = usePublicChatState();
  const { customPublicChats } = useCustomPublicChatState();
  const { user } = useUserState();

  const currentChat = customPublicChats.get(currentChannel)?.customChatUsers;
  if (!currentChat) return null;
  const usersToJoin = publicChatUsers.filter(
    u =>
      u.stompUsername !== user?.stompUsername &&
      !currentChat.some(chatUser => chatUser.stompUsername === u.stompUsername)
  );

  return (
    <VStack mt={'20px'} w={'100%'} color={'white'} alignItems={'start'} justifyContent={'start'}>
      {usersToJoin.map(u => (
        <Box
          onClick={() => {
            if (!u.stompUsername) {
              console.error('No stomp user name for user ' + u.username);
              return;
            }
            addToChat(u.stompUsername);
          }}
          color={'white'}
          key={u.stompUsername}
          border={'2px solid white'}
          borderRadius={'20px'}
          px={'10px'}
          py={'5px'}
          cursor={'pointer'}
          _hover={{
            bg: 'white',
            color: 'black',
          }}
        >
          {u.username}
        </Box>
      ))}
    </VStack>
  );
};
