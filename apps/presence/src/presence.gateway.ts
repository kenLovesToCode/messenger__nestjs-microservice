import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Server, Socket } from 'socket.io';
import { firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';

import { FriendRequestEntity, UserJwt } from '@app/shared';
import { IActiveUser } from './interfaces/active-user.interface';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }

  async handleConnection(socket: Socket) {
    console.log('HANDLE CONNECTION');
  }
}
