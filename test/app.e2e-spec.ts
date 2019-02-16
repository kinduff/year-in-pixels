import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    app.set('view engine', 'jade')
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
    // TODO: e2e expectations to be defined
  })
})
