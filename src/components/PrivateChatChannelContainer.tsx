import { Box, Circle } from '@chakra-ui/react';
import { PrivateChat } from '../state/usePrivateMessagesState';

interface Props {
  chatChannel: PrivateChat;
  setChannel: (channel: string) => void;
  currentChatWindow: boolean;
}

export const PrivateChatChannelContainer = ({ chatChannel, setChannel, currentChatWindow }: Props) => {
  if (currentChatWindow) {
    chatChannel.clearUnreadMessages();
  }

  return (
    <>
      <Box
        position={'relative'}
        bgColor={currentChatWindow ? 'whatsapp.100' : 'whatsapp.500'}
        color={currentChatWindow ? 'whatsapp.700' : 'white'}
        border={currentChatWindow ? '3px solid green' : 'none'}
        w={'80%'}
        mt={'10px'}
        p={'5px'}
        textAlign={'center'}
        borderRadius={'20px'}
        onClick={() => setChannel(chatChannel.stompUsername)}
        _hover={{
          cursor: 'pointer',
          color: 'whatsapp.700',
          bgColor: 'whatsapp.100',
        }}
      >
        {chatChannel.unreadMessages === 0 && chatChannel.username}
        {chatChannel.unreadMessages > 0 && <strong>{chatChannel.username}</strong>}
        {chatChannel.unreadMessages > 0 && (
          <Circle
            pos={'absolute'}
            right={'5px'}
            top={'0px'}
            bottom={'0px'}
            marginTop={'auto'}
            marginBottom={'auto'}
            bg={'red'}
            color={'white'}
            size={'1.8rem'}
          >
            {chatChannel.unreadMessages}
          </Circle>
        )}
      </Box>
    </>
  );
};
