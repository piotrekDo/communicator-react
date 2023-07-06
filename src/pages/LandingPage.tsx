import { Flex } from '@chakra-ui/react';
import { Login } from '../components/Login';
import useUserState from '../state/useUserState';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const { user } = useUserState();
  const navigate = useNavigate();

  if(user) {
    navigate('/chat');
  }

  return (
    <Flex bg={'blue.200'} w={'100vw'} h={'100vh'} justifyContent={'center'} alignItems={'center'}>
      <Login />
    </Flex>
  );
};
