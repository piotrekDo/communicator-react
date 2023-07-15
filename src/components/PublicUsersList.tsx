import { HStack, VStack, Box } from '@chakra-ui/react';
import { ChatUser } from '../model/User';

interface Props {
    publicChatUsers: ChatUser[];
    addPrivateChat: (stomp: string, name: string) => void;
}

export const PublicUsersList = ({publicChatUsers, addPrivateChat}: Props) => {
  return (
    <HStack w={'100%'} h={'100%'}>
    <VStack h={'100%'} w={'100%'} justifyContent={'start'} alignItems={'start'} color={'white'}>
      {publicChatUsers.map(u => (
        <Box
          key={u.username}
          onClick={() => {
            if (!u.stompUsername) return;
            addPrivateChat(u.stompUsername, u.username);
          }}
          border={'2px solid white'}
          borderRadius={'15px'}
          py={'2px'}
          px={'10px'}
          cursor={'pointer'}
          _hover={{ bg: 'black', opacity: '.8' }}
        >
          {u.stompUsername}
        </Box>
      ))}
    </VStack>
    <Box h={'100%'} w={'100%'}></Box>
  </HStack>
  )
}
