import { Controller, Get, Render } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    const grid = this.appService.getGrid()
    const moodOptions = this.appService.getMoods()
    return { grid, moodOptions }
  }
}
