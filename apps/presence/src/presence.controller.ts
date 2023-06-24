import { CacheInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { RedisService } from '@app/shared/services/redis.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly redisService: RedisService,
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(CacheInterceptor)
  async getPresence(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    const foo = await this.redisService.get('foo');

    if (foo) {
      console.log('CACHED');
      return foo;
    }

    const f = await this.presenceService.getFoo();
    this.redisService.set('foo', f);

    return f;
  }
}
