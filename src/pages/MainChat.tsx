import { Flex, HStack, VStack } from '@chakra-ui/react';
import useUserState from '../state/useUserState';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const MainChat = () => {
  const navigate = useNavigate();
  const { user } = useUserState();

  if (!user) navigate('/');
  return (
    <VStack bg={'linkedin.400'} w={'100vw'} h={'100vh'}>
      <Navbar />
      <HStack p={'20px'} w={'100%'} h={'100%'}>
        <VStack bg={'blackAlpha.400'} w={'300px'} h={'100%'} borderRadius={'20px 0 0 20px'}></VStack>
        <VStack bg={'blackAlpha.400'} w={'90%'} h={'100%'} borderRadius={'0 20px 20px 0'}></VStack>
      </HStack>
    </VStack>
  );
};
