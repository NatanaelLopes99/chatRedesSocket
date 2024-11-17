import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import TcpSocket from 'react-native-tcp-socket'; // Para TCP
import dgram from 'react-native-udp'; // Para UDP
import { RouteProp } from '@react-navigation/native'; // Corrigido para importar de @react-navigation/native
import { StackNavigationProp } from '@react-navigation/stack'; // Para navegação com StackNavigator

// Definir o tipo para as propriedades de navegação
type RootStackParamList = {
  Home: undefined;
  Chat: { protocol: 'tcp' | 'udp' };
};

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type ChatScreenProps = {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { protocol } = route.params;
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (protocol === 'tcp') {
      // Conexão com o servidor TCP
      const tcpClient = TcpSocket.createConnection(
        {
          host: '127.0.0.1', // Endereço do servidor (pode ser IPv6 ou IPv4)
          port: 3000,        // Porta do servidor TCP
        },
        () => {
          console.log('Conectado ao servidor TCP');
        }
      );

      tcpClient.on('data', (data: any) => {
        setMessages((prevMessages) => [...prevMessages, data.toString()]);
      });

      tcpClient.on('error', (error: any) => {
        console.log('Erro de conexão TCP:', error);
      });

      tcpClient.on('close', () => {
        console.log('Conexão TCP fechada');
      });

      setSocket(tcpClient);

      return () => {
        tcpClient.end();
      };
    } else if (protocol === 'udp') {
      // Conexão com o servidor UDP (usando o tipo de IP disponível automaticamente)
      const udpSocket = dgram.createSocket({ type: 'udp4' }); // Corrigido para usar { type: 'udp4' }

      udpSocket.on('message', (msg: Buffer) => {
        setMessages((prevMessages) => [...prevMessages, msg.toString()]);
      });

      udpSocket.on('error', (err: any) => {
        console.log('Erro UDP:', err);
      });

      setSocket(udpSocket);

      return () => {
        udpSocket.close();
      };
    }
  }, [protocol]);

  const sendMessage = () => {
    if (protocol === 'tcp' && socket && message) {
      socket.write(message); // Enviar mensagem via TCP
      setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);
      setMessage('');
    } else if (protocol === 'udp' && socket && message) {
      const messageBuffer = Buffer.from(message);
      socket.send(messageBuffer, 0, messageBuffer.length, 4000, '127.0.0.1', (err: Error) => {
        if (err) {
          console.log('Erro ao enviar mensagem UDP:', err);
        } else {
          setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);
          setMessage('');
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{protocol.toUpperCase()} Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Digite sua mensagem"
      />
      <Button title="Enviar" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default ChatScreen;
