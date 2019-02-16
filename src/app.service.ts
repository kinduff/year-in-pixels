import { Injectable } from '@nestjs/common'
import monthNames from './constants/month-names'
import Grid from './interfaces/grid.interface'
import Moods from './interfaces/moods.interface'

@Injectable()
export class AppService {
  getGrid(): Grid {
    const grid: Grid = {}
    for (let i = 0; i < monthNames.length; i++) {
      grid[monthNames[i]] = this.daysInMonth(i + 1)
    }
    return grid
  }

  private daysInMonth(monthNumber: number): number {
    const year = new Date().getFullYear()
    return new Date(year, monthNumber, 0).getDate()
  }

  getMoods(): Moods {
    return {
      5: 'amazing',
      4: 'great',
      3: 'average',
      2: 'difficult',
      1: 'tough',
      0: 'none'
    }
  }
}
