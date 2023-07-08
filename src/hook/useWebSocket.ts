import { useEffect, useRef, useState } from 'react';
import { Stomp, Client, Frame } from '@stomp/stompjs';

const useWebSocket = (
  userName: string,
  setStompUserName: (name: string) => void,
  onMessageReceivedGlobal: any,
  onMessageReceivedPrivate: any
) => {
  const clientRef = useRef<Client | null>(null);
  const [webSocketClient, setWebSocketClient] = useState<Client | null>(null);

  useEffect(() => {
    const initializeWebSocket = async () => {
      const socket = new WebSocket(`ws://localhost:8080/websocket-connect?user=${userName}`);
      const stompClient = Stomp.over(socket);
      clientRef.current = stompClient;

      stompClient.connect({}, (frame: Frame) => {
        if (!clientRef.current) return;
        const stompName = (frame.headers as { 'user-name': string })['user-name']
        clientRef.current.subscribe('/global', onMessageReceivedGlobal);
        clientRef.current.subscribe(`/user/priv`, onMessageReceivedPrivate);
        setStompUserName(stompName);
        setWebSocketClient(clientRef.current);
      });
    };

    initializeWebSocket();

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        // clientRef.current.disconnect();
      }
    };
  }, []);

  return webSocketClient;
};

export default useWebSocket;
