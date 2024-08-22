import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationFilter } from './presenter/http/errors/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  const config = new DocumentBuilder()
    .setTitle('Fleets API')
    .setDescription('API for managing Fleets')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('reference', app, document);
  app.useGlobalFilters(new ValidationFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
