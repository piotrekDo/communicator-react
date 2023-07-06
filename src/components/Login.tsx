import { Box, FormControl, FormLabel, Input, Button, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { AuthRequest } from '../model/Auth';
import LoginService from '../service/LoginService';
import useUserState from '../state/useUserState';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '../hook/useWebSocket';

interface FormData {
  username: string;
  userPassword: string;
}

export const Login = () => {
  const { login } = useUserState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmitDataHandler = (data: FieldValues) => {
    setError(null);
    setIsLoading(true);
    const authRequest: AuthRequest = { username: data.username, userPassword: data.userPassword };
    const { httpRequest } = LoginService.login(authRequest);
    httpRequest
      .then(res => {
        login(res.data);
        setIsLoading(false);
        navigate('/chat');
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        setError(err.response.data ? err.response.data.details : err.message);
      });
  };

  return (
    <Box bg={'messenger.400'} p={'20px'} borderRadius={'30px'}>
      <form onSubmit={handleSubmit(onSubmitDataHandler)}>
        <Heading fontSize={'3rem'}>Zaloguj się</Heading>
        <VStack width={'100%'} marginTop={'20px'}>
          <FormControl>
            <FormLabel fontSize={'1.5rem'}>Imię</FormLabel>
            <Input {...register('username')} type='text' />
          </FormControl>
          <FormControl>
            <FormLabel fontSize={'1.5rem'}>Hasło</FormLabel>
            <Input {...register('userPassword')} type='password' />
          </FormControl>
          <Flex width={'100%'} justifyContent={'space-between'}>
            <Text fontSize={'1.3rem'} textColor={'red.600'} w={'100%'} textAlign={'center'}>
              <i>{error}</i>
            </Text>
          </Flex>
          <Button
            bg={'linkedin.400'}
            borderRadius={'20px'}
            w={'60%'}
            isLoading={isLoading}
            loadingText={'Czekaj...'}
            type='submit'
          >
            Loguj
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
