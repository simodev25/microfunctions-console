const getUrl = window.location;
const protocol = getUrl.protocol + "//";
const apiUrl = protocol + getUrl.hostname;
export const environment = {
  production: true,
  portUrl: window["env"]["portUrl"] ,
  apiUrl: (protocol + window["env"]["apiUrl"]) || apiUrl,
  debug: window["env"]["debug"] || false,
  pathUrl: window["env"]["pathUrl"] ,
};
