const local = {
    REACT_APP_BACKEND_BASE_URL: "http://localhost:3000/"
};

// TODO: Fill this before code is merged in production
const prod = {
    REACT_APP_BACKEND_BASE_URL: ""
};

const getEnv = () => {
  const host = window.location.hostname;
  let env = local;

  if (host === "prod-base-url") {
    env = prod;
  }

  return env;
};

const env = getEnv();
export default env;
