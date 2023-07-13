interface PublicMessageRaw {
  type?: string;
  senderName: string;
  senderStompName: string;
  message: string;
  time?: string;
}

interface PrivateMessageRaw {
  type?: string;
  senderName: string;
  senderStompName: string;
  receiverStompName: string;
  message: string;
  time?: string;
}

interface PublicMessage {
  type?: string;
  senderName: string;
  senderStompName: string;
  message: string;
  time: Date;
}

interface PrivateMessage {
  type?: string;
  senderName: string;
  senderStompName: string;
  receiverStopName: string;
  message: string;
  time: Date;
  wasRead: boolean;
}
