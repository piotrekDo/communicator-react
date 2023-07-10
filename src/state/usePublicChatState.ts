import { create } from 'zustand';

interface PublicChatState {
  messages: PublicMessage[];
  addPublicMessage: (msg: PublicMessageRaw) => void;
  unreadPubMessages: number;
  clearUnreadPubMessages: () => void;
}

const usePublicChatState = create<PublicChatState>(set => ({
  messages: [],
  unreadPubMessages: 0,
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
      unreadPubMessages: store.unreadPubMessages + 1,
    })),
  clearUnreadPubMessages: () => set(store => ({
    ...store,
    unreadPubMessages: 0,
  })),
}));

export default usePublicChatState;
