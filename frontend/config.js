// URL base da API consumida pelo front-end (sem "/" no fim).
//   localhost / 127.0.0.1 -> ""  = mesma origem (json-server com --static, porta 3000)
//   ficheiro aberto (file://) -> json-server local
//   qualquer outro host (Render, Vercel...) -> API em produção
// Para usar a API Express local (porta 3001), trocar LOCAL_API_BASE por "http://localhost:3001".
const PROD_API_BASE = "https://sir-api-alunos.onrender.com";
const LOCAL_API_BASE = "";

const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

window.APP_CONFIG = {
  API_BASE:
    location.protocol === "file:" ? "http://localhost:3000" : isLocalHost ? LOCAL_API_BASE : PROD_API_BASE,
};
