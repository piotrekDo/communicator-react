import { useEffect, useRef, useState } from 'react';
import { Stomp, Client, Frame, CompatClient } from '@stomp/stompjs';

const useWebSocket = (
  userName: string,
  jwtToken: string,
  setStompUserName: (name: string) => void,
  onMessageReceivedGlobal: any,
  onMessageReceivedPrivate: any
) => {
  const clientRef = useRef<CompatClient | null>(null);
  const [webSocketClient, setWebSocketClient] = useState<Client | null>(null);

  const headers = {
    Authorization: 'Bearer ' + jwtToken,
  };

  useEffect(() => {
    const initializeWebSocket = async () => {
      const socket = new WebSocket(`ws://localhost:8080/websocket-connect?user=${userName}`);
      const stompClient = Stomp.over(socket);
      clientRef.current = stompClient;

      clientRef.current.connect(headers, (frame: Frame) => {
        if (!clientRef.current) return;
        const stompName = (frame.headers as { 'user-name': string })['user-name'];
        setWebSocketClient(clientRef.current);
        setStompUserName(stompName);
        clientRef.current.subscribe('/global', onMessageReceivedGlobal, headers);
        clientRef.current.subscribe(`/user/priv`, onMessageReceivedPrivate, headers);
      });
    };

    initializeWebSocket();

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        // clientRef.current.disconnect();
      }
    };
  }, []);

  const subscribeToCustomPublicChat = (channelName: string, onMessageReceivedFunc: any) => {
    if (!webSocketClient) {
      console.error('NO WEBSOCKET CLIENT');
      return;
    }
    webSocketClient.subscribe(`/global/${channelName}`, onMessageReceivedFunc, headers);
  };

  return { webSocketClient, subscribeToCustomPublicChat };
};

export default useWebSocket;
