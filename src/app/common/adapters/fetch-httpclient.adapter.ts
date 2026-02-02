import type { HttpClient, HttpResponse } from '../interfaces/http-client'

export class FetchHttpClientAdapter implements HttpClient {
  async get<TResponse = unknown>(
    url: string,
  ): Promise<HttpResponse<TResponse>> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return {
      data: (await response.json()) as TResponse,
      status: response.status,
    }
  }

  async post<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
  ): Promise<HttpResponse<TResponse>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return {
      data: (await response.json()) as TResponse,
      status: response.status,
    }
  }

  async put<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
  ): Promise<HttpResponse<TResponse>> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return {
      data: (await response.json()) as TResponse,
      status: response.status,
    }
  }

  async delete<TResponse = unknown>(
    url: string,
  ): Promise<HttpResponse<TResponse>> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return {
      data: (await response.json()) as TResponse,
      status: response.status,
    }
  }
}
