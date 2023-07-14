import { create } from 'zustand';

export interface PrivateChat {
  stompUsername: string;
  username: string;
  typingUsers: string[];
  input: string;
  setInput: (data: string) => void;
  privateMessages: PrivateMessage[];
  unreadMessages: number;
  clearUnreadMessages: () => void;
}

interface PrivateMessagesState {
  privateChats: Map<string, PrivateChat>;
  addPrivateChat: (stompUsername: string, username: string) => void;
  removePrivateChat: (stompUsername: string) => void;
  addMessageToPrivateChat: (msg: PrivateMessageRaw) => void;
}

const contains = (chats: Map<string, PrivateChat>, name: string, name2 = name): boolean => {
  return chats.get(name) !== undefined || chats.get(name2) !== undefined;
};

const createNewMessage = (msg: PrivateMessageRaw): PrivateMessage => {
  return {
    senderName: msg.senderName,
    senderStompName: msg.senderStompName,
    receiverStopName: msg.receiverStompName,
    message: msg.message,
    time: msg.time ? new Date(msg.time) : new Date(),
    wasRead: false,
  };
};

const usePrivateMessagesState = create<PrivateMessagesState>(set => ({
  privateChats: new Map<string, PrivateChat>(),
  addPrivateChat: (stompUsername, username) =>
    set(store => ({
      ...store,
      privateChats: contains(store.privateChats, stompUsername)
        ? store.privateChats
        : store.privateChats.set(stompUsername, {
            stompUsername: stompUsername,
            username: username,
            typingUsers: [],
            input: '',
            setInput: function (data: string) {
              this.input = data;
            },
            privateMessages: [],
            unreadMessages: 0,
            clearUnreadMessages: function () {
              this.unreadMessages = 0;
            },
          }),
    })),
  removePrivateChat: stompUsername =>
    set(store => {
      const privateChats = new Map(store.privateChats);
      privateChats.delete(stompUsername);
      return {
        ...store,
        privateChats: privateChats,
      };
    }),
  addMessageToPrivateChat: msg => {
    const sysMsg = msg.type && msg.type === 'SYSTEM';
    set(store => {
      const privateChats = new Map(store.privateChats);

      if (sysMsg) {
        const chat = privateChats.get(msg.senderStompName);
        if (chat) {
          const chatTypingUsers = chat.typingUsers;
          if (msg.message === 'typing-start') {
            chatTypingUsers.push(msg.senderName);
          } else {
            chat.typingUsers = chatTypingUsers.filter(u => u !== msg.senderName);
          }
        }
      } else {
        const senderChat = privateChats.get(msg.senderStompName);
        const receiverChat = privateChats.get(msg.receiverStompName);

        if (!senderChat && !receiverChat) {
          privateChats.set(msg.senderStompName, {
            stompUsername: msg.senderStompName,
            username: msg.senderName,
            typingUsers: [],
            input: '',
            setInput: function (data: string) {
              this.input = data;
            },
            privateMessages: [createNewMessage(msg)],
            unreadMessages: 1,
            clearUnreadMessages: function () {
              this.unreadMessages = 0;
            },
          });
        } else {
          if (senderChat) {
            senderChat.privateMessages.push(createNewMessage(msg));
            if (msg.senderStompName !== msg.receiverStompName) {
              senderChat.unreadMessages += 1;
            }
          }

          if (receiverChat && msg.senderStompName !== msg.receiverStompName) {
            receiverChat.privateMessages.push(createNewMessage(msg));
            receiverChat.unreadMessages += 1;
          }
        }
      }
      return {
        ...store,
        privateChats: privateChats,
      };
    });
  },
}));

export default usePrivateMessagesState;
