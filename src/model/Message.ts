interface PublicMessageRaw {
  senderName: string;
  senderStompName: string;
  message: string;
  time?: string;
}

interface PublicMessage {
  senderName: string;
  senderStompName: string;
  message: string;
  time: Date;
}