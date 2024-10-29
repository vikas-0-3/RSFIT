import axios from "axios";
import {
  ADD_EXERCISE,
  ADMIN_DASHBOARD_STATS_URL,
  CREATE_DIET_PDF_URL,
  CREATE_PDF_URL,
  DELETE_EXERCISE,
  EXERCISE_LIST,
  PROGAMS_LIST_URL,
  UPDATE_USER_STATUS_BASE_URL,
  USERS_LIST,
  USER_LOGIN_URL,
  USER_REGISTRATION_URL,
  VIDEO_DOWNLOAD_BASE_URL,
  VIDEO_UPLOAD_URL,
} from "../config/urls";
import {
  USER_AUTHENTICATION_FAILED_MSG,
  PDF_CREATION_FAILED_MSG,
  EXERCISE_ADD_ERROR,
  EXCERCISE_GET_ERROR,
} from "./contants";

// This file contains all the API calls

export const userLogin = async (email, password) => {
  const url = USER_LOGIN_URL;
  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
    });
    const data = response?.data;
    return {
      success: true,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ?? USER_AUTHENTICATION_FAILED_MSG;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const userRegistration = async (
  email,
  password,
  name,
  phoneNumber,
  gender,
  age = null,
  height = null,
  weight = null,
  address = null,
  profession = null,
  medicalHistory = null,
  nonVeg = null,
  smoking = null,
  drinking = null,
  foodAllergy = null,
  goal = null,
  workoutTime = null,
  workoutPlace = null,
  workoutExperience = null,
  previousExperience = null,
  supplements = null,
  otherInfo = null
) => {
  const url = USER_REGISTRATION_URL;
  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
      name: name,
      phone: phoneNumber,
      gender: gender,
      age: age,
      height: height,
      weight: weight,
      address: address,
      profession: profession,
      medicalHistory: medicalHistory,
      nonVeg: nonVeg,
      smoking: smoking,
      drinking: drinking,
      foodAllergy: foodAllergy,
      goal: goal,
      workoutTime: workoutTime,
      workoutPlace: workoutPlace,
      workoutExperience: workoutExperience,
      previousExperience: previousExperience,
      supplements: supplements,
      otherInfo: otherInfo,
    });
    const data = response?.data;
    return {
      success: true,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ?? USER_AUTHENTICATION_FAILED_MSG;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const getProgramsList = async () => {
  const url = PROGAMS_LIST_URL;
  try {
    const response = await axios.get(url);
    const data = response?.data;
    return {
      success: true,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ?? USER_AUTHENTICATION_FAILED_MSG;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const getUsersList = async () => {
  const url = USERS_LIST;
  try {
    const response = await axios.get(url);
    const data = response?.data;
    return {
      success: true,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ?? USER_AUTHENTICATION_FAILED_MSG;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const getAllExercises = async () => {
  const url = EXERCISE_LIST;
  try {
    const response = await axios.get(url);
    const data = response?.data;
    return {
      success: true,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.error ?? EXCERCISE_GET_ERROR;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const addExercise = async (name, link) => {
  const url = ADD_EXERCISE;
  try {
    const response = await axios.post(url, {
      name: name,
      link: link,
    });
    const data = response?.data;
    return {
      success: true,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.error ?? EXERCISE_ADD_ERROR;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const deleteExercise = async (id) => {
  const url = `${DELETE_EXERCISE}/${id}`;
  axios
    .delete(url)
    .then((response) => {
      console.log("Exercise deleted:", response.data);
    })
    .catch((error) => {
      console.error("There was an error deleting the exercise:", error);
    });
};

export const uploadVideo = async (id, tag, file, type) => {
  const url = VIDEO_UPLOAD_URL;
  const formData = new FormData();
  formData.append("id", id);
  formData.append("tag", tag);
  formData.append("media", file);
  formData.append("type", type);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    const data = response?.data;
    return {
      success: true,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.error ?? VIDEO_UPLOAD_URL;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const createPDF = async (pdfData) => {
  const url = CREATE_PDF_URL;
  try {
    const response = await axios.post(url, pdfData, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob", // This is important for receiving binary data
    });

    // Create a Blob from the PDF Stream
    const file = new Blob([response.data], { type: "application/pdf" });

    // Create a link element, hide it, direct it towards the blob, and then trigger a click
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "fitness_program.pdf";
    link.click();

    return {
      success: true,
      error: null,
      data: "PDF downloaded successfully",
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ?? PDF_CREATION_FAILED_MSG;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const createDietPDF = async (pdfData) => {
  const url = CREATE_DIET_PDF_URL;
  try {
    const response = await axios.post(url, pdfData, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob", // This is important for receiving binary data
    });

    // Create a Blob from the PDF Stream
    const file = new Blob([response.data], { type: "application/pdf" });

    // Create a link element, hide it, direct it towards the blob, and then trigger a click
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "fitness_program.pdf";
    link.click();

    return {
      success: true,
      error: null,
      data: "PDF downloaded successfully",
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ?? PDF_CREATION_FAILED_MSG;
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

export const downloadVideo = async (exercise, user, type) => {
  const fileName = type == 'video' ? user.videos[exercise] : user.photos[exercise];
  if (!fileName) {
    return { success: false };
  }

  try {
    const response = await axios({
      method: "GET",
      url: `${VIDEO_DOWNLOAD_BASE_URL}${fileName}`,
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const updateUserStatus = async (id, active) => {
  const url = `${UPDATE_USER_STATUS_BASE_URL}${id}/${
    active == true ? "activate" : "deactivate"
  }`;
  try {
    const response = await axios.put(url);
    const data = response?.data;
    return {
      success: data.success,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage = "Error while updating status";
    console.log("error", error);
    return { success: false, error: errorMessage };
  }
};

export const getStatistics = async () => {
  const url = ADMIN_DASHBOARD_STATS_URL;
  try {
    const response = await axios.get(url);
    const data = response?.data;
    return {
      success: data.success,
      error: null,
      data: data,
    };
  } catch (error) {
    const errorMessage = "Error while getting stats";
    return { success: false, error: errorMessage };
  }
};
