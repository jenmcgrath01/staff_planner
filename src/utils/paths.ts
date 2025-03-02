export const getAssetPath = (path: string) => {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '' : '/or-schedule';
  return `${baseUrl}${path}`;
}; 