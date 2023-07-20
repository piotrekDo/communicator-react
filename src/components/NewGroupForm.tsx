import { Button, FormControl, HStack, Heading, Input, VStack } from '@chakra-ui/react';
import { FormEvent, useState } from 'react';

interface Props {
  onCreateNewGroup: (name: string) => void;
}

export const NewGroupForm = ({ onCreateNewGroup }: Props) => {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    if (!input) return;
    e.preventDefault();
    onCreateNewGroup(input);
    setInput('');
  };

  return (
    <VStack color={'white'} h={'30%'} justifyContent={'center'}>
      <Heading fontSize={'2rem'}>Stwórz nową grupę</Heading>
      <form onSubmit={handleSubmit}>
        <HStack
          bg={'blackAlpha.700'}
          color={'white'}
          w={'100%'}
          h={'50px'}
          border={'3px solid white'}
          borderRadius={'30px'}
        >
          <FormControl
            _focus={{
              border: 'none',
            }}
            w={'90%'}
            h={'100%'}
            mx={0}
          >
            <Input
              _focus={{
                border: 'none',
              }}
              border={'none'}
              bg={'blackAlpha.700'}
              w={'100%'}
              h={'100%'}
              px={'15px'}
              borderRadius={'30px 0 0 30px'}
              type='text'
              placeholder='Nazwa grupy'
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </FormControl>
          <Button onClick={handleSubmit} type='submit' h={'100%'} w={'120px'} mx={0} borderRadius={'0 30px 30px 0'} color={'white'}>
            Stwórz
          </Button>
        </HStack>
      </form>
    </VStack>
  );
};
