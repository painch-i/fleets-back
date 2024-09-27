import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'static'),
      // serve static html files from the rootPath
      serveRoot: '/static',
      serveStaticOptions: {
        // cache static files for 1 day
        maxAge: 86400,
      },
    }),
  ],
})
export class StaticModule {}
