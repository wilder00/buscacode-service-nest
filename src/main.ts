import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { AppModule } from './app.module'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || []
  app.use(cookieParser(process.env.COOKIE_SECRET))

  app.enableCors({
    origin: allowedOrigins,
    credentials: true, // if you use cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-apollo-operation-name',
      'Apollo-Require-Preflight'
    ]
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false
    })
  )

  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
