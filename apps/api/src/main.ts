import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(5000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as fs from 'fs';

// async function bootstrap() {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//   const httpsOptions = {
//     key: fs.readFileSync('./ssl/server.key'),
//     cert: fs.readFileSync('./ssl/server.crt'),
//   };
//   const app = await NestFactory.create(AppModule, { httpsOptions });
//   app.enableCors();
//   await app.listen(5000);
// }
// bootstrap();
