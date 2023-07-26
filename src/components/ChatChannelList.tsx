import { Box, Circle, VStack } from '@chakra-ui/react';
import { PrivateChatChannelContainer } from './PrivateChatChannelContainer';
import usePrivateMessagesState from '../state/usePrivateMessagesState';
import usePublicChatState from '../state/usePublicChatState';
import { useEffect } from 'react';
import useCustomPublicChatState from '../state/useCustomPublicState';
import { CustomGroupChannelContainer } from './CustomGroupChannelContainer';

interface Props {
  setChannel: (channel: string) => void;
  currentChatWindow: string;
}

export const ChatChannelList = ({ setChannel, currentChatWindow }: Props) => {
  const { customPublicChats } = useCustomPublicChatState();
  const { privateChats } = usePrivateMessagesState();
  const { unreadPubMessages, clearUnreadPubMessages } = usePublicChatState();

  useEffect(() => {
    if (currentChatWindow === 'Public') {
      if (unreadPubMessages > 0) clearUnreadPubMessages();
    }
  });

  return (
    <VStack bg={'blackAlpha.900'} w={'300px'} h={'100%'} borderRadius={'20px'}>
      <Box
        onClick={() => setChannel('new-custom')}
        border={'3px solid white'}
        borderRadius={'20px'}
        px={'5px'}
        py={'2px'}
        mt={'10px'}
        w={'60%'}
        color={'white'}
        textAlign={'center'}
        cursor={'pointer'}
        _hover={{
          color: 'black',
          bg: 'white',
        }}
      >
        NOWA GRUPA
      </Box>
      <Box
        position={'relative'}
        bgColor={currentChatWindow === 'Public' ? 'whatsapp.100' : 'whatsapp.500'}
        color={currentChatWindow === 'Public' ? 'whatsapp.700' : 'white'}
        border={currentChatWindow === 'Public' ? '3px solid green' : 'none'}
        w={'80%'}
        mt={'10px'}
        p={'5px'}
        textAlign={'center'}
        borderRadius={'20px'}
        onClick={() => setChannel('Public')}
        _hover={{
          cursor: 'pointer',
          color: 'whatsapp.700',
          bgColor: 'whatsapp.100',
        }}
      >
        {unreadPubMessages === 0 && 'Public'}
        {unreadPubMessages > 0 && <strong>Public</strong>}
        {unreadPubMessages > 0 && (
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
            {unreadPubMessages}
          </Circle>
        )}
      </Box>
      {Array.from(customPublicChats.values()).map(chat => (
        <CustomGroupChannelContainer
          key={chat.chatName}
          chatChannel={chat}
          setChannel={setChannel}
          currentChatWindow={chat.chatName === currentChatWindow}
        />
      ))}
      {Array.from(privateChats.values()).map(chat => (
        <PrivateChatChannelContainer
          key={chat.stompUsername}
          chatChannel={chat}
          setChannel={setChannel}
          currentChatWindow={chat.stompUsername === currentChatWindow}
        />
      ))}
    </VStack>
  );
};
