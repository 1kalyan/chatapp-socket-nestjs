import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3254);

  const port = process.env.PORT ?? 3755;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  // await app.listen(port, '0.0.0.0'); // Listen on all network interfaces
  console.log(`Server listening on port ${port}`);
}
void bootstrap();
