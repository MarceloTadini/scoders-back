import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupRedoc } from './shared/middlewares/redoc.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());


  app.enableCors({
    origin: true,  
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization', 
  });

  const config = new DocumentBuilder()
    .setTitle('API de Produtos SCODERS')
    .setDescription('API de produtos com sistemas de autenticação, cache e websocket.')
    .setContact('Marcelo Tadini', 'https://github.com/MarceloTadini', 'tadini.marcelo53@gmail.com')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  setupRedoc(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();