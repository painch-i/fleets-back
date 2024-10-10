import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'node:path';
import * as repl from 'node:repl';
import { AppModule } from './app.module';
import { ConfigService, FleetsEnvironmentEnum } from './config/config.service';
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
  const configService = app.get(ConfigService);
  const fleetsEnv = configService.get('FLEETS_ENV');
  if (fleetsEnv === FleetsEnvironmentEnum.DEVELOPMENT) {
    const historyFile = path.resolve(__dirname, '.repl_history');
    const replServer = repl.start({
      prompt: 'fleets> ',
    });
    replServer.setupHistory(historyFile, (err) => {
      if (err) console.error(err);
    });
    Object.assign(replServer.context, getAllProviders(AppModule));
    Object.assign(replServer.context, { $: app.get });
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

function getAllProviders(module: any, providers: Record<string, any> = {}) {
  const modules = Reflect.getMetadata('imports', module);
  const moduleProviders = Reflect.getMetadata('providers', module) || [];
  moduleProviders.forEach((provider: any) => {
    providers[provider.name] = provider;
  });
  if (modules) {
    modules.forEach((m: any) => getAllProviders(m, providers));
  }
  return providers;
}
