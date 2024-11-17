const net = require('net');

// Criando o servidor TCP
const tcpServer = net.createServer((socket) => {
  console.log('Cliente TCP conectado');

  // Enviar uma mensagem de boas-vindas quando um cliente se conectar
  socket.write('Bem-vindo ao servidor TCP!');

  // Escutando as mensagens enviadas pelo cliente
  socket.on('data', (data) => {
    console.log('Mensagem recebida via TCP: ' + data);
    
    // Enviar a mensagem de volta para o cliente
    socket.write('Você disse: ' + data);
  });

  // Quando o cliente se desconectar
  socket.on('end', () => {
    console.log('Cliente TCP desconectado');
  });
});

// O servidor escutará na porta 3000 para TCP
tcpServer.listen(3000, '127.0.0.1', () => {
  console.log('Servidor TCP escutando na porta 3000');
});
