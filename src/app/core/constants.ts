export enum AUTH_EVENTS {
    loginSuccess = 'auth-login-success',
    loginFailed = 'auth-login-failed',
    logoutSuccess = 'auth-logout-success',
    sessionTimeout = 'auth-session-timeout',
    notAuthenticated = 'auth-not-authenticated',
    notAuthorized = 'auth-not-authorized'
};

export const CONSTANTS = {
    KEY: 'C@Ed',
    IVSA: 'dc0da04af8fee58593442bf834b30739'
};

export const CRYPTO_CONST = {
    keySize: 4,
    iterationCount: 1000
};

export const CONFIGURACOES = {
    REST_ADDRESS: 'http://localhost:8080/sislame/rest/',
    IS_PRODUCAO: false,
    DATA_VERSAO: 'PARAM_DATA_BUILD'
}

export const CORES = ['liquidGreen', 'yellow', 'blue', 'purple', 'red', 'green', 'brown', 'pink', 'oragenBackground', 'gold'];

export const HORAS_TOKEN = 6;

