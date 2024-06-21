import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import { IEtnaApi } from '../../domain/users/interfaces/etna-api.interface';

const ETNA_API_BASE_URL = 'https://auth.etna-alternance.net';
const ETNA_DEFAULT_USERNAME = 'painch_i';
const AUTH_COOKIE_NAME = 'authenticator';
const AUTH_COOKIE_REGEX = new RegExp(
  `(?:^|\s)${AUTH_COOKIE_NAME}\=(?<token>[^\;]+)`,
);

@RequiredEnv({
  key: 'ETNA_DEFAULT_USER_PASSWORD',
  schema: z.string(),
})
@Injectable()
export class EtnaApi implements IEtnaApi {
  constructor(private configService: ConfigService) {}

  async getUserInfo(login: string) {
    const userInfo = await this.apiCall<any>(
      `${ETNA_API_BASE_URL}/api/users/${login}`,
      {
        method: 'GET',
      },
    );
    return {
      firstName: userInfo.firstname,
      lastName: userInfo.lastname,
    };
  }

  private async getDefaultUserAccessToken(): Promise<string> {
    const body = new URLSearchParams({
      login: ETNA_DEFAULT_USERNAME,
      password: this.configService.get<string>('ETNA_DEFAULT_USER_PASSWORD'),
    });
    const response = await fetch(`${ETNA_API_BASE_URL}/login`, {
      method: 'POST',
      body,
    });
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }
    // Get access token from "authenticator" cookie
    const cookies = response.headers.get('set-cookie');
    if (!cookies) {
      throw new Error('Failed to get access token');
    }

    const match = cookies.match(AUTH_COOKIE_REGEX);
    if (!match) {
      throw new Error('Failed to get access token');
    }
    const accessToken = match.groups?.token;
    if (!accessToken) {
      throw new Error('Failed to get access token');
    }
    return accessToken;
  }

  private async apiCall<T>(url: string, options: RequestInit): Promise<T> {
    const accessToken = await this.getDefaultUserAccessToken();
    // Set "authenticator" cookie
    options.headers = {
      ...options.headers,
      Cookie: `${AUTH_COOKIE_NAME}=${accessToken}`,
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to call ETNA API');
    }
    const contentType = response.headers.get('content-type');
    let content: T;
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      content = text as T;
    } else {
      const json = await response.json();
      content = json as T;
    }
    return content;
  }
}
