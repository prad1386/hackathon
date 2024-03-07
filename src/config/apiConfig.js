const NODE_ENV = process.env.NODE_ENV;

const apiConfig = {
  development: {
    hostname: process.env.REACT_APP_HOST,
    port: process.env.REACT_APP_PORT,
  },
  test: {
    hostname: process.env.REACT_APP_HOST,
    port: process.env.REACT_APP_PORT,
  },
  production: {
    hostname: process.env.REACT_APP_HOST,
    port: process.env.REACT_APP_PORT,
  },
};

export const getApiUrl = () => {
  return apiConfig[NODE_ENV];
};
