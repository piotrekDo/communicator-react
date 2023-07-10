import { create } from 'zustand';

export interface PrivateChat {
  stompUsername: string;
  username: string;
  privateMessages: PrivateMessage[];
  unreadMessages: number;
  clearUnreadMessages: () => void;
}

interface PrivateMessagesState {
  privateChats: PrivateChat[];
  addPrivateChat: (stompUsername: string, username: string) => void;
  removePrivateChat: (stompUsername: string) => void;
  addMessageToPrivateChat: (msg: PrivateMessageRaw) => void;
}

const contains = (table: PrivateChat[], name: string, name2 = name): boolean => {
  return table.findIndex(element => element.stompUsername === name || element.stompUsername == name2) > -1;
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
  privateChats: [],
  addPrivateChat: (stompUsername, username) =>
    set(store => ({
      ...store,
      privateChats: contains(store.privateChats, stompUsername)
        ? store.privateChats
        : [
            ...store.privateChats,
            {
              stompUsername: stompUsername,
              username: username,
              privateMessages: [],
              unreadMessages: 0,
              clearUnreadMessages: function () {
                this.unreadMessages = 0;
              },
            },
          ],
    })),
  removePrivateChat: stompUsername =>
    set(store => ({
      ...store,
      privateChats: store.privateChats.filter(chat => chat.stompUsername !== stompUsername),
    })),
  addMessageToPrivateChat: msg =>
    set(store => ({
      ...store,
      privateChats: contains(store.privateChats, msg.senderStompName, msg.receiverStompName)
        ? store.privateChats.map(chat =>
            chat.stompUsername === msg.senderStompName || chat.stompUsername === msg.receiverStompName
              ? {
                  ...chat,
                  privateMessages: [...chat.privateMessages, createNewMessage(msg)],
                  unreadMessages:
                    chat.stompUsername === msg.senderStompName ? chat.unreadMessages + 1 : chat.unreadMessages,
                }
              : chat
          )
        : [
            ...store.privateChats,
            {
              stompUsername: msg.senderStompName,
              username: msg.senderName,
              privateMessages: [createNewMessage(msg)],
              unreadMessages: 1,
              clearUnreadMessages: function () {
                this.unreadMessages = 0;
              },
            },
          ],
    })),
}));

export default usePrivateMessagesState;
