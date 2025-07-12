/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchLibraryGithubData(repo: string) {
    try {
      const res: any = await lastValueFrom(
        this.httpService.get(`https://api.github.com/repos/${repo}`, {
          headers: {
            Authorization: `token ${this.configService.get('GITHUB_TOKEN')}`,
          },
        }),
      );

      if (!res) {
        return null;
      }

      return (res.data.stargazers_count as number) || 0;
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
