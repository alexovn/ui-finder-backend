import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NpmService } from './npm.service';

@Module({
  imports: [HttpModule],
  providers: [NpmService],
})
export class NpmModule {}
