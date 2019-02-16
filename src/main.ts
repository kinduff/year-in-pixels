import { NestFactory } from '@nestjs/core'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.set('view engine', 'jade')
  await app.listen(3000)
}
bootstrap()
