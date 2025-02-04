import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import {  Server, Socket } from 'socket.io';

@WebSocketGateway(
  {
    cors : {
      origin : "*"
    },
    path : "/socket"
  }
)
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  Server : Server

  
  async handleConnection(socket : Socket) {
    console.log("connected")
  }

  async handleDisconnect(socket : Socket) {
    console.log("disconnected")
  }

  @SubscribeMessage("chat-send")
  async sendMessage(socket : Socket, data : any) {

    const {message} = data
    
    this.Server.emit("chat-receive", message)
  
  }
  
}
