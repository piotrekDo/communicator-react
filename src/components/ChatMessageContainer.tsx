import { Box, Button, Flex, Text } from '@chakra-ui/react';
import useUserState from '../state/useUserState';
import usePrivateMessagesState from '../state/usePrivateMessagesState';

interface Props {
  msg: PublicMessage | PrivateMessage;
  prevName: string;
  prevTime: Date | null;
  setChannel: (channel: string) => void;
}

export const ChatMessageContainer = ({ msg, prevName, prevTime, setChannel }: Props) => {
  const {privateChats, addPrivateChat} = usePrivateMessagesState();
  const { user } = useUserState();
  const isUser = msg.senderStompName === user!.stompUsername;

  if (!msg.time) return null;

  const prevMsgTime = prevTime ? prevTime : new Date('');

  const msgTime = msg.time;
  const hours = msgTime.getHours().toString().padStart(2, '0'); // Zwraca godzinę jako liczba (0-23)
  const minutes = msgTime.getMinutes().toString().padStart(2, '0');
  const seconds = msgTime.getSeconds().toString().padStart(2, '0');

  const displayTime =
    msgTime.getTime() - prevMsgTime.getTime() > 60000 || Number.isNaN(msgTime.getTime() - prevMsgTime.getTime());
  return (
    <Flex flexDirection={'column'} width={'100%'} title={`${hours}:${minutes}:${seconds}`}>
      {displayTime && (
        <Text width={'100%'} textAlign={'center'} fontSize={'1.2rem'} color={'white'}>
          <strong>
            {hours}:{minutes}
          </strong>
        </Text>
      )}
      <Box width={'fit-content'} alignSelf={isUser ? 'end' : 'start'}>
        {((!isUser && prevName != msg.senderName) || (!isUser && displayTime)) && (
          <Button color={'wheat'} pt={'20px'} ml={5} onClick={() => {
            addPrivateChat(msg.senderStompName, msg.senderName);
            setChannel(msg.senderStompName);
          }}>
            {msg.senderName}
          </Button>
        )}
        <Text
          fontSize={'1.3rem'}
          color={'white'}
          borderRadius={'20px'}
          py={2}
          px={5}
          bg={isUser ? 'whatsapp.600' : 'facebook.700'}
        >
          {msg.message}
        </Text>
      </Box>
    </Flex>
  );
};
