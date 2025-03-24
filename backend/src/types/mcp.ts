export interface MCPRequest {
  version: string;
  action: string;
  params: {
    [key: string]: any;
  };
}

export interface MCPResponse {
  version: string;
  status: 'success' | 'error';
  data: any;
  error: string | null;
}
