export const environment = {
  production: false,
  hmr: true,
  backend: false,
  portUrl: window["env"]["portUrl"] || "80",
  apiUrl: window["env"]["apiUrl"] || "default",
  debug: window["env"]["debug"] || false,
  pathUrl: window["env"]["pathUrl"] || "",
};
