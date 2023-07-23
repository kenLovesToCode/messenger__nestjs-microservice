import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Socket } from 'socket.io';
import { firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';

import { FriendRequestEntity, UserJwt } from '@app/shared';
import { IActiveUser } from './interfaces/active-user.interface';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private logger: Logger = new Logger('MessageGateway');

  @WebSocketServer() server: any;

  //remove in production
  async onModuleInit() {
    await this.cache.reset();
  }

  afterInit(server: any) {
    this.logger.log('WEBSOCKET INITIALIZED');
  }

  private async getFriends(userId: number) {
    const ob$ = this.authService.send<FriendRequestEntity[]>(
      { cmd: 'get-friends' },
      { userId },
    );

    const friendRequests = await firstValueFrom(ob$).catch((err) =>
      console.error(err),
    );

    if (!friendRequests) return;

    const friends = friendRequests.map((friendRequest) => {
      const isUserCreator = userId === friendRequest.creator.id;
      const friendDetails = isUserCreator
        ? friendRequest.receiver
        : friendRequest.creator;

      const { id, firstName, lastName, email } = friendDetails;

      return {
        id,
        email,
        firstName,
        lastName,
      };
    });

    return friends;
  }

  private async emitStatusToFriends(activeUser: IActiveUser) {
    const friends = await this.getFriends(activeUser.id);

    for (const f of friends) {
      const user = await this.cache.get(`user ${f.id}`);

      if (!user) continue;

      const friend = user as IActiveUser;

      this.server.to(friend.socketId).emit('friendActive', {
        id: activeUser.id,
        isActive: activeUser.isActive,
      });

      if (activeUser.isActive) {
        this.server.to(activeUser.socketId).emit('friendActive', {
          id: friend.id,
          isActive: friend.isActive,
        });
      }
    }
  }

  private async setActiveStatus(socket: Socket, isActive: boolean) {
    this.logger.log('SETTING ACTIVE ', socket.data);
    const user = socket.data?.user;

    if (!user) return;

    const activeUser: IActiveUser = {
      id: user.id,
      socketId: socket.id,
      isActive,
    };

    await this.cache.set(`user ${user.id}`, activeUser, 0);
    await this.emitStatusToFriends(activeUser);
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`CLIENT DISCONNECTED: ${socket.id}`);
    console.log('HANDLE DISCONNECT');

    await this.setActiveStatus(socket, false);
  }

  async handleConnection(socket: Socket) {
    this.logger.log(`CLIENT CONNECTED: ${socket.id}`);

    const jwt = socket.handshake.headers.authorization ?? null;

    if (!jwt) {
      await this.handleDisconnect(socket);
      return;
    }

    const ob$ = this.authService.send<UserJwt>({ cmd: 'decode-jwt' }, { jwt });
    const res = await firstValueFrom(ob$).catch((err) => console.error(err));

    if (!res || !res?.user) {
      await this.handleDisconnect(socket);
      return;
    }

    const { user } = res;

    socket.data.user = user;
    console.log('setting active status ', socket);

    await this.setActiveStatus(socket, true);
  }

  //auto sign out
  @SubscribeMessage('updateActiveStatus')
  async updateActiveStatus(socket: Socket, isActive: boolean) {
    console.log('isActive: ', isActive);
    console.log('SOCKET: ', socket.data);
    if (!socket.data?.user) return;

    await this.setActiveStatus(socket, isActive);
  }

  @SubscribeMessage('testingLang')
  async testing(@MessageBody() test: string) {
    console.log('TESTING LANG');
    this.logger.log('TEST ONLY HAHAHA ', test);
    // console.log('SOCKET: ', socket.data);
    // if (!socket.data?.user) return;

    // await this.setActiveStatus(socket, isActive);
  }

  @SubscribeMessage('testKen')
  async kentest(@MessageBody() ken: string) {
    console.log('TESTING LANG KEN');
    this.logger.log('TEST ONLY KEN ', ken);
    // console.log('SOCKET: ', socket.data);
    // if (!socket.data?.user) return;

    // await this.setActiveStatus(socket, isActive);
  }
}
