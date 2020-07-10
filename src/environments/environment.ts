// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //serverUrl: 'https://api-ideas-urbanas.uhemisferios.edu.ec/',
  serverUrl: 'https://ideas-urbanas-api.herokuapp.com/',
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
