interface PublicMessageRaw {
  senderName: string;
  senderStompName: string;
  message: string;
  time?: string;
}

interface PrivateMessageRaw {
  senderName: string;
  senderStompName: string;
  receiverStompName: string;
  message: string;
  time?: string;
}

interface PublicMessage {
  senderName: string;
  senderStompName: string;
  message: string;
  time: Date;
}

interface PrivateMessage {
  senderName: string;
  senderStompName: string;
  receiverStopName: string;
  message: string;
  time: Date;
  wasRead: boolean;
}
