import { create } from 'zustand';

interface PublicChatState {
  messages: PublicMessage[];
  addPublicMessage: (msg: PublicMessageRaw) => void;
}

const usePublicChatState = create<PublicChatState>(set => ({
  messages: [],
  addPublicMessage: msg =>
    set(store => ({
      ...store,
      messages: [
        ...store.messages,
        {
          senderName: msg.senderName,
          senderStompName: msg.senderStompName,
          message: msg.message,
          time: msg.time ? new Date(msg.time) : new Date(),
        },
      ],
    })),
}));

export default usePublicChatState;
