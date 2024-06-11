export interface DatabaseConnection {
  query<TResponse = any, TParams = any>(statement: string, params: TParams): Promise<TResponse>
  close(): Promise<void>
}