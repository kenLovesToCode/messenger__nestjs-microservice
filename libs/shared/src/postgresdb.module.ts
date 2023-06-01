import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        autoLoadEntities: true,
        synchronize: true,
      }),

      //production
      // useFactory: () => ({
      //   ...dataSourceOptions,
      //   autoLoadEntities: true,
      //   synchronize: true, //for development purpose only
      // }),
      inject: [ConfigService],
    }),
  ],
})
export class PostgresDBModule {}
