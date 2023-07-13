import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';
import useUserState from '../state/useUserState';

export const Navbar = () => {
  const { user } = useUserState();
  return (
    <Flex bg={'blackAlpha.900'} color={'wheat'} h={'50px'} w={'100%'} paddingX={'40px'} justifyContent={'space-between'} alignItems={'center'}>
      <Box>LOGO</Box>
      <Box>
        <Text>{user?.username}</Text>
      </Box>
    </Flex>
  );
};
