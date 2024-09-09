
interface ApiConfig {
  provider: 'openai' | 'claude';
  apiKey: string;
  apiBase?: string;
  apiModel?: string;
}


export const saveApiConfig = (config: ApiConfig) => {
  localStorage.setItem('apiConfig', JSON.stringify(config));
};

export const getApiConfig = (): ApiConfig | null => {
  const config = localStorage.getItem('apiConfig');
  return config ? JSON.parse(config) : null;
};