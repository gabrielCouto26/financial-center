export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
}

type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private baseUrl(): string {
    return this.config.baseUrl;
  }

  private async getHeaders(): Promise<Headers> {
    const headers = new Headers();
    const token = await this.config.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  public async fetch<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = await this.getHeaders();
    
    if (
      init.body &&
      typeof init.body === 'string' &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(url, { ...init, headers });
    
    if (res.status === 204) {
      return undefined as T;
    }

    const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;

    if (!res.ok) {
      if (res.status === 401) {
        await this.config.clearToken();
      }
      const msg = data.message;
      const text = Array.isArray(msg) ? msg.join(', ') : msg ?? res.statusText;
      throw new Error(text || 'Request failed');
    }

    return data as T;
  }

  public async setToken(token: string): Promise<void> {
    await this.config.setToken(token);
  }

  public async clearToken(): Promise<void> {
    await this.config.clearToken();
  }

  public async getToken(): Promise<string | null> {
    return await this.config.getToken();
  }
}
