import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { IProduct } from '../schemas/models/product.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
  namespace: '/products',
})
export class ProductGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ProductGateway.name);
  private connectedClients = new Set<string>();

  handleConnection(client: Socket) {
    this.connectedClients.add(client.id);
    this.logger.log(`Cliente conectado: ${client.id}. Total: ${this.connectedClients.size}`);
    
    // Enviar status de conexão
    client.emit('connected', {
      message: 'Conectado ao servidor de produtos',
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Cliente desconectado: ${client.id}. Total: ${this.connectedClients.size}`);
  }

  emitNewProduct(product: IProduct) {
    this.server.emit('productCreated', {
      product,
      timestamp: new Date().toISOString(),
      message: 'Novo produto criado!',
    });
    
    this.logger.log(`📡 Produto emitido via WebSocket: ${product}`);
  }

  emitProductUpdate(product: IProduct) {
    this.server.emit('productUpdated', {
      product,
      timestamp: new Date().toISOString(),
      message: 'Produto atualizado!',
    });
  }

}