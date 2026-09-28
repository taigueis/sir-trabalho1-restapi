// URL base da API consumida pelo front-end (sem "/" no fim).
//   ""                           -> mesma origem (json-server com --static, porta 3000)
//   "http://localhost:3001"      -> API Express local
//   "https://<a-tua-api>.onrender.com" -> API em produção (Render)
window.APP_CONFIG = {
  API_BASE: "",
};
