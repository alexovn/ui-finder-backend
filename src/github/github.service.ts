import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async fetchLibraryGithubData(repo: string) {
    try {
      const res: any = await lastValueFrom(
        this.httpService.get(`https://api.github.com/repos/${repo}`),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return res;
    } catch (err: any) {
      const axiosError = err as AxiosError;

      if (axiosError.response) {
        console.error(
          'GitHub API error:',
          axiosError.response.status,
          axiosError.response.data,
        );
        throw new InternalServerErrorException(
          `GitHub API error: ${axiosError.response.status}`,
        );
      } else if (axiosError.request) {
        console.error('No response from GitHub API');
        throw new InternalServerErrorException('No response from GitHub API');
      } else {
        console.error('Unexpected error:', axiosError.message);
        throw new InternalServerErrorException(
          'Unexpected error while fetching GitHub data',
        );
      }
    }
  }
}
