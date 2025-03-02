export const getAssetPath = (path: string) => {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '' : '/staff_planner';
  return `${baseUrl}${path}`;
}; 