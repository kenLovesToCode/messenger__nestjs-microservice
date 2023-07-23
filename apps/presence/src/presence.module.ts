import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule, SharedModule } from '@app/shared';
import { PresenceGateway } from './presence.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { TodosGateway } from './todos.gateway';

@Module({
  imports: [
    CacheModule.register(),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [PresenceController],
  providers: [PresenceService, TodosGateway],
})
export class PresenceModule {}
