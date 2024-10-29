import env from "./env";

export const USER_LOGIN_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/users/login");

export const USER_REGISTRATION_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/users/register");

export const PROGAMS_LIST_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/programs");

export const USERS_LIST =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/admin/users");

export const EXERCISE_LIST = env.REACT_APP_BACKEND_BASE_URL.concat(
  "api/admin/exercises"
);

export const ADD_EXERCISE =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/admin/exercise");

export const DELETE_EXERCISE =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/admin/exercise");

export const VIDEO_UPLOAD_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/upload");

export const VIDEO_DOWNLOAD_BASE_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/download/");

export const IMAGE_DOWNLOAD_BASE_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/download/");

export const CREATE_PDF_URL = env.REACT_APP_BACKEND_BASE_URL.concat(
  "api/admin/create-pdf"
);

export const CREATE_DIET_PDF_URL = env.REACT_APP_BACKEND_BASE_URL.concat(
  "api/admin/create-diet-plan"
);

export const UPDATE_USER_STATUS_BASE_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/users/");

export const ADMIN_DASHBOARD_STATS_URL =
  env.REACT_APP_BACKEND_BASE_URL.concat("api/users/stats");
