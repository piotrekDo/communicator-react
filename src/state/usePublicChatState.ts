import { create } from 'zustand';
import { ChatUser } from '../model/User';

interface PublicChatState {
  messages: PublicMessage[];
  publicChatUsers: ChatUser[];
  setUsers: (users: string[]) => void;
  joinUser: (chatUser: string) => void;
  removeUser: (chatUser: string) => void;
  typingUsers: string[];
  input: string;
  setInput: (data: string) => void;
  addPublicMessage: (msg: PublicMessageRaw) => void;
  unreadPubMessages: number;
  clearUnreadPubMessages: () => void;
}

const addLeaveMessage = (user: string): PublicMessage => {
  return {
    type: 'SYSTEM-LEAVE',
    senderName: user,
    senderStompName: user,
    message: '',
    time: new Date(),
  };
};

const usePublicChatState = create<PublicChatState>(set => ({
  messages: [],
  publicChatUsers: [],
  setUsers: newUsers =>
    set(store => ({
      ...store,
      publicChatUsers: newUsers.map(u => ({ username: u, stompUsername: u })),
    })),
  joinUser: user =>
    set(store => ({
      ...store,
      publicChatUsers: [...store.publicChatUsers, { username: user, stompUsername: user }],
    })),
  removeUser: user =>
    set(store => ({
      ...store,
      publicChatUsers: store.publicChatUsers.filter(u => u.stompUsername !== user),
      messages: [...store.messages, addLeaveMessage(user)],
    })),
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
