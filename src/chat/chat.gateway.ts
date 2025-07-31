import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// @WebSocketGateway(3754, {
//   cors: {
//     origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5500'],
//     methods: ['GET', 'POST'], // allow frontend
//   },
// })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;

//   handleConnection(client: Socket) {
//     console.log('New user connected:', client.id);
//     client.broadcast.emit('user-joined', {
//       message: `New user joined the chat: ${client.id}`,
//     });
//   }

//   handleDisconnect(client: Socket) {
//     console.log('User disconnected:', client.id);
//     this.server.emit('user-left', {
//       message: `User left the chat: ${client.id}`,
//     });
//   }

//   @SubscribeMessage('newMessage')
//   handleNewMessage(client: Socket, message: string) {
//     console.log('New message from', client.id, ':', message);

//     // Send message with sender ID
//     this.server.emit('message', {
//       senderId: client.id,
//       text: message,
//     });
//   }
// }

// //socket.on()

// //client.emit() // this is between client
// //io.emit() this is used for broadcasting
// //server.emit

@WebSocketGateway({
  cors: {
    origin: [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'https://1kalyan.github.io',
    ],
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private users: Map<string, string> = new Map(); // socket.id -> username

  handleConnection(client: Socket) {
    console.log('New user connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id) || client.id;
    this.users.delete(client.id);
    console.log('User disconnected:', username);
    this.server.emit('user-left', {
      message: `${username} left the chat.`,
    });
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(client: Socket, username: string) {
    this.users.set(client.id, username);
    console.log(`User ${client.id} set their name to ${username}`);
    client.emit('username-confirmed'); // Notify client username was accepted
    client.broadcast.emit('user-joined', {
      message: `${username} joined the chat.`,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, message: string) {
    const username = this.users.get(client.id) || client.id;
    console.log('Message from', username, ':', message);

    this.server.emit('message', {
      sender: username,
      text: message,
    });
  }
}
