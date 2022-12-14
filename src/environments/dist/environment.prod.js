"use strict";
exports.__esModule = true;
exports.environment = void 0;
exports.environment = {
    production: true,
    env: 'prod',
    serverUrl: 'http://miserver:3000/',
    stage: 'dev/',
    auth: {
        base: 'auth/',
        login: 'login/',
        forgotPassword: 'forgotPassword/',
        forceChangePassword: 'forceChangePassword/'
    },
    users: {
        base: 'user/'
    },
    config: {
        base: 'config/'
    },
    province: {
        base: 'province/'
    },
    canton: {
        base: 'canton'
    },
    parish: {
        base: 'parroquia'
    },
    research: {
        base: 'research'
    },
    origin: {
        base: 'origin'
    },
    clasification: {
        base: 'clasification'
    },
    reports: {
        base: 'reports'
    },
    variable: {
        base: 'variable'
    },
    data: {
        base: 'data',
        indexes: 'indexes'
    },
    charts: {
        base: 'charts',
        yearsAvailableForVariable: 'yearsAvailableForVariable'
    },
    category: {
        base: 'category'
    },
    tag: {
        base: 'tag'
    },
    home: {
        getVariablesByClasification: 'getVariableByClasification',
        getResearchsByCatAndCant: 'getResearchsByCatAndCant',
        getTagsByCantByType: 'getTagsByCantByType',
        addTag: 'addTag',
        getStopwords: 'getStopwords'
    },
    indicator: {
        base: 'indicator'
    }
};
