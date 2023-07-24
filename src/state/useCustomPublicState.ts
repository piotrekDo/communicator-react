import { create } from 'zustand';
import { ChatUser } from '../model/User';

export interface CustomPublicChat {
  chatName: string;
  customChatUsers: ChatUser[];
  setUsers: (users: string[]) => void;
  joinUser: (stompUserName: string, username: string) => void;
  removeUser: (chatUser: string) => void;
  typingUsers: string[];
  input: string;
  setInput: (data: string) => void;
  messages: PublicMessage[];
  unreadMessages: number;
  clearUnreadMessages: () => void;
}

interface CustomPublicChatsState {
  customPublicChats: Map<string, CustomPublicChat>;
  addCustomPublicChat: (chatName: string) => void;
  removeCustomPublicChat: (chatName: string) => void;
  addMessageToCustomPublicChat: (chat: string, msg: PublicMessageRaw) => void;
  userLeaveCustomPublicChat: (stompUsername: string) => void;
}

const createChatMessage = (msg: PublicMessageRaw): PublicMessage => {
  return {
    senderName: msg.senderName,
    senderStompName: msg.senderStompName,
    message: msg.message,
    time: msg.time ? new Date(msg.time) : new Date(),
  };
};

const useCustomPublicChatState = create<CustomPublicChatsState>(set => ({
  customPublicChats: new Map<string, CustomPublicChat>(),
  addCustomPublicChat: (chatName) =>
    set((store) => {
      const chats = store.customPublicChats;
      if (chats.get(chatName) !== undefined) return store;
      chats.set(chatName, {
        chatName: chatName,
        customChatUsers: [],
        setUsers: function (users) {
          this.customChatUsers = users.map((u) => ({ username: u, stompUsername: u }));
        },
        joinUser: function (stomp, name) {
          this.customChatUsers.push({ username: name, stompUsername: stomp });
        },
        removeUser: function (stomp) {
          this.customChatUsers = this.customChatUsers.filter((u) => u.stompUsername !== stomp);
        },
        typingUsers: [],
        input: '',
        setInput: function (inputData) {
          this.input = inputData;
        },
        messages: [],
        unreadMessages: 0,
        clearUnreadMessages: function () {
          this.unreadMessages = 0;
        },
      });
      return store;
    }),
  removeCustomPublicChat: chatName =>
    set(store => {
      store.customPublicChats.delete(chatName);
      return store;
    }),
  addMessageToCustomPublicChat: (chatName, msg) =>
    set(store => {
      const chats = store.customPublicChats;
      const chat = chats.get(chatName);
      if (!chat) return store;
      const sysMsg = msg.type && msg.type === 'SYSTEM';
      if (sysMsg) {
        const chatTypingUsers = chat.typingUsers;
        if (msg.message === 'typing-start') {
          chatTypingUsers.push(msg.senderName);
        } else {
          chat.typingUsers.push(msg.senderName);
        }
      } else {
        chat.messages.push(createChatMessage(msg));
        chat.unreadMessages += 1;
      }

      return store;
    }),
  userLeaveCustomPublicChat: () => {},
}));

export default useCustomPublicChatState;
