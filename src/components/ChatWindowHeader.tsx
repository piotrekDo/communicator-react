import { VStack, HStack, Box } from '@chakra-ui/react'

interface Props {
    currentChatWindow: string;
    chatWindowView: string;
    publicChatUsers: number;
    setChatWindowView: (windowName: 'messages' | 'users' | 'add-user') => void;
}

export const ChatWindowHeader = ({currentChatWindow, chatWindowView, publicChatUsers, setChatWindowView}:Props) => {
  return (
    <VStack
    w={'100%'}
    h={'120px'}
    borderBottom={'3px solid white'}
    color={'whiteAlpha.900'}
    justifyContent={'start'}
    alignItems={'start'}
  >
    <Box fontSize={'2rem'}>{currentChatWindow}</Box>
    <HStack w={'32%'} justifyContent={'space-between'}>
      <Box
        onClick={() => setChatWindowView('messages')}
        border={'1px solid white'}
        borderRadius={'20px'}
        py={'2px'}
        px={'10px'}
        bg={chatWindowView === 'messages' ? 'whiteAlpha.800' : ''}
        color={chatWindowView === 'messages' ? 'black' : ''}
        cursor={'pointer'}
      >
        Wiadomości
      </Box>
      {(currentChatWindow === 'Public' || currentChatWindow.includes('custom')) &&(
        <Box
          onClick={() => setChatWindowView('users')}
          border={'1px solid white'}
          borderRadius={'20px'}
          py={'2px'}
          px={'10px'}
          bg={chatWindowView === 'users' ? 'whiteAlpha.800' : ''}
          color={chatWindowView === 'users' ? 'black' : ''}
          cursor={'pointer'}
        >
          Osoby ({publicChatUsers})
        </Box>
      )}
      {currentChatWindow.includes('custom') && (
        <Box
        onClick={() => setChatWindowView('add-user')}
        border={'1px solid white'}
        borderRadius={'20px'}
        py={'2px'}
        px={'10px'}
        bg={chatWindowView === 'add-user' ? 'whiteAlpha.800' : ''}
        color={chatWindowView === 'add-user' ? 'black' : ''}
        cursor={'pointer'}
      >
        Dodaj osobę
      </Box>
      )}
    </HStack>
  </VStack>
  )
}
