(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiUrl"] = "${CONTROLLER_HOST}";
  window["env"]["pathUrl"] = "${CONTROLLER_PATH}";
  window["env"]["portApi"] = "${CONTROLLER_PORT}";
  window["env"]["debug"] = "${DEBUG}";
})(this);
