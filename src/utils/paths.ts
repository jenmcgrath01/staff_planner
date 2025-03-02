export const getAssetPath = (path: string) => {
  const isDev = import.meta.env.DEV;
  return isDev ? path : `/staff_planner${path}`;
}; 