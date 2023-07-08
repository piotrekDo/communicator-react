import { Box } from '@chakra-ui/react';

interface Props {
  stompUsername: string;
  username: string;
  setChannel: (channel: string) => void;
  currentChatWindow: boolean;
}

export const ChatChannelContainer = ({ username, stompUsername, setChannel, currentChatWindow }: Props) => {
  return (
    <>
      <Box
        bgColor={currentChatWindow ? 'whatsapp.100' : 'whatsapp.500'}
        color={currentChatWindow? 'whatsapp.700' : 'white'}
        border={currentChatWindow ? '3px solid green' : 'none'}
        w={'80%'}
        mt={'10px'}
        p={'5px'}
        textAlign={'center'}
        borderRadius={'20px'}
        onClick={() => setChannel(stompUsername)}
        _hover={{
          cursor: 'pointer',
          color: 'whatsapp.700',
          bgColor: 'whatsapp.100',
        }}
      >
        {username}
      </Box>
    </>
  );
};
