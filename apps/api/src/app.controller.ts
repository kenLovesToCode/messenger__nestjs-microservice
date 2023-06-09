import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  @Get('auth')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Post('auth')
  async createUser() {
    return this.authService.send(
      {
        cmd: 'post-user',
      },
      {},
    );
  }

  @Get('presence')
  async getPresence() {
    return this.presenceService.send(
      {
        cmd: 'get-presence',
      },
      {},
    );
  }

  // @Get('test')
  // async sendMessage(message: any): Promise<any> {
  //   const correlationId = 'fjksfjlskfskj'; // Generate a unique correlation ID
  //   const pattern = 'my_pattern'; // Set the message pattern
  //   const payload = message; // Set the message payload

  //   // Create a promise that resolves when a message with the same correlation ID is received
  //   const responsePromise = new Promise((resolve) => {
  //     this.channel.consume('my_queue', (msg: Message | null) => {
  //       if (msg && msg.propertsies.correlationId === correlationId) {
  //         const response = msg.content.toString(); // Parse the response message
  //         resolve(response);
  //         this.channel.ack(msg); // Acknowledge the message
  //       }
  //     });
  //   });

  //   // Send the message with the correlation ID as a property in the message headers
  //   this.channel.sendToQueue('my_queue', Buffer.from(payload), {
  //     correlationId,
  //     replyTo: 'my_queue',
  //   });

  //   const response = await responsePromise; // Wait for the response to arrive

  //   return response;
  // }
}
