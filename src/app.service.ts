import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthcheck(): { status: string } {
    return { status: 'ok' };
  }
}
