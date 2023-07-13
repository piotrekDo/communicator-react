import { create } from 'zustand';

interface PublicChatState {
  messages: PublicMessage[];
  typingUsers: string[];
  input: string;
  setInput: (data: string) => void;
  addPublicMessage: (msg: PublicMessageRaw) => void;
  unreadPubMessages: number;
  clearUnreadPubMessages: () => void;
}

const usePublicChatState = create<PublicChatState>(set => ({
  messages: [],
  typingUsers: [],
  input: '',
  setInput: data =>
    set(store => ({
      ...store,
      input: data,
    })),
  unreadPubMessages: 0,
  addPublicMessage: msg => {
    if (msg.type && msg.type === 'SYSTEM') {
      set(store => ({
        ...store,
        typingUsers:
          msg.message === 'typing-start'
            ? [...store.typingUsers, msg.senderName]
            : [...store.typingUsers.filter(u => u !== msg.senderName)],
      }));
    } else {
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
      }));
    }
  },
  clearUnreadPubMessages: () =>
    set(store => ({
      ...store,
      unreadPubMessages: 0,
    })),
}));

export default usePublicChatState;
