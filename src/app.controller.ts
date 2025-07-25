import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/healthcheck')
  getHealthcheck(): { status: string } {
    return this.appService.getHealthcheck();
  }
}
