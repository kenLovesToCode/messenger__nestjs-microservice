import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // useFactory: (configService: ConfigService) => ({
      //   type: 'postgres',
      //   url: configService.get('POSTGRES_URI'),
      //   autoLoadEntities: true,
      //   synchronize: true,
      // }),

      //production
      useFactory: () => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
        synchronize: true, //for development purpose only
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
