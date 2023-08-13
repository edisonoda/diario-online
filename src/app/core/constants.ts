enum AUTH_EVENTS {
    loginSuccess = 'auth-login-success',
    loginFailed = 'auth-login-failed',
    logoutSuccess = 'auth-logout-success',
    sessionTimeout = 'auth-session-timeout',
    notAuthenticated = 'auth-not-authenticated',
    notAuthorized = 'auth-not-authorized'
};

const CONSTANTS = {
    KEY: 'C@Ed',
    IVSA: 'dc0da04af8fee58593442bf834b30739'
};

const CRYPTO_CONST = {
    keySize: 128,
    iterationCount: 1000
};