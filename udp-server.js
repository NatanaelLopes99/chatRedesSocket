const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

// O servidor escutará na porta 4000 para UDP
udpServer.on('message', (msg, rinfo) => {
  console.log(`Mensagem recebida via UDP: ${msg} de ${rinfo.address}:${rinfo.port}`);

  // Enviar uma resposta para o cliente
  const response = Buffer.from('Mensagem recebida via UDP');
  udpServer.send(response, rinfo.port, rinfo.address, (err) => {
    if (err) console.error('Erro ao enviar resposta:', err);
  });
});

// O servidor UDP escuta na porta 4000
udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`Servidor UDP escutando em ${address.address}:${address.port}`);
});

udpServer.bind(4000);
