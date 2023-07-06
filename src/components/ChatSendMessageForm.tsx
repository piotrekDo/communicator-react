import React from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../model/User';
import { IPublishParams, StompHeaders } from '@stomp/stompjs';
import { Button, FormControl, Input } from '@chakra-ui/react';

interface Props {
  user: User;
  publish: ((params: IPublishParams) => void) | undefined;
}

export const ChatSendMessageForm = ({ user, publish }: Props) => {
  interface FormData {
    message: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handleSubmitPublicMessage = (data: FormData) => {
    if (!user) return;
    if (!publish) {
      console.error('socket.publish is undefined.');
      return;
    }
    const message = {
      senderName: user.username,
      senderStompName: user.stompUsername,
      message: data.message,
    };

    console.log("MESSSAGE");
    console.log("MESSSAGE");
    console.log("MESSSAGE");
    console.log("MESSSAGE");
    console.log(message)
    console.log("MESSSAGE");
    console.log("MESSSAGE");
    console.log("MESSSAGE");
    console.log("MESSSAGE");
    publish({ destination: '/websocket/global', body: JSON.stringify(message) });
  };

  return (
    <form
      onSubmit={handleSubmit(data => {
        handleSubmitPublicMessage(data);
        reset();
      })}
    >
      <FormControl>
        <Input type='text' placeholder='message' {...register('message')} />
      </FormControl>
      <Button type='submit'>Submit</Button>
    </form>
  );
};
