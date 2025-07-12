/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class NpmService {
  constructor(private readonly httpService: HttpService) {}

  async fetchLibraryNpmData(packageName: string) {
    try {
      const res: any = await lastValueFrom(
        this.httpService.get(
          `https://api.npmjs.org/downloads/point/last-month/${packageName}`,
        ),
      );

      if (!res) {
        return null;
      }

      return (res.data.downloads as number) || 0;
    } catch (err: any) {
      const axiosError = err as AxiosError;

      if (axiosError.response) {
        console.error(
          'NPM API error:',
          axiosError.response.status,
          axiosError.response.data,
        );
        throw new InternalServerErrorException(
          `NPM API error: ${axiosError.response.status}`,
        );
      } else if (axiosError.request) {
        console.error('No response from NPM API');
        throw new InternalServerErrorException('No response from NPM API');
      } else {
        console.error('Unexpected error:', axiosError.message);
        throw new InternalServerErrorException(
          'Unexpected error while fetching NPM data',
        );
      }
    }
  }
}
