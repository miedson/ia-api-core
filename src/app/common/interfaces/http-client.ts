export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequest<TBody = unknown> {
  url: string
  method: HttpMethod
  body?: TBody
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
}

export interface HttpResponse<TResponse = unknown> {
  status: number
  data: TResponse
  headers?: Record<string, string>
}

export interface HttpClient {
  get<TResponse = unknown>(
    url: string,
    options?: Omit<HttpRequest, 'url' | 'method'>,
  ): Promise<HttpResponse<TResponse>>

  post<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: Omit<HttpRequest<TBody>, 'url' | 'method' | 'body'>,
  ): Promise<HttpResponse<TResponse>>

  put<TResponse = unknown, TBody = unknown>(
    url: string,
    body: TBody,
    options?: Omit<HttpRequest<TBody>, 'url' | 'method' | 'body'>,
  ): Promise<HttpResponse<TResponse>>

  delete<TResponse = unknown>(
    url: string,
    options?: Omit<HttpRequest, 'url' | 'method'>,
  ): Promise<HttpResponse<TResponse>>
}
