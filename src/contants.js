import consultImg from "./assets/consult.jpg";
import beforeImage from "./assets/6O9A2315.jpg";
import superBeginning from "./assets/superBeginning.jpg";
import superBulk from "./assets/superBulk.jpg";
import superShred from "./assets/superShred.jpg";
import collection from "./assets/collection.jpg";

export const MEDIA_FOR_PROGRAMS = {
  "SUPER BEGINNING": [superBeginning, "kyRZOtN89s4", collection],
  "SUPER SHRED": [superShred, "kyRZOtN89s4", collection],
  "SUPER BULK": [superBulk, "kyRZOtN89s4", collection],
  "Video Consultation": [consultImg, "kyRZOtN89s4"],
  "Online Personal Training": [consultImg, "kyRZOtN89s4"],
  "SUPER BEGINNING + SUPER SHRED": [beforeImage, "kyRZOtN89s4", collection],
  "SUPER BEGINNING + SUPER BULK": [beforeImage, "kyRZOtN89s4", collection],
  "90-Day Online Body Transformation Program": [
    beforeImage,
    "kyRZOtN89s4",
    collection,
  ],
};

export const POPUP_DISCOUNT_PLAN_TITLE = "90-Day Online Body Transformation Program";

export const VIDEO_NAME_MAPPER = {
  freeSquats: "Squats",
  pushUps: "PushUps",
  pullUps: "PullUps",
  barDips: "BarDips",
  jumpingJacks: "JumpingJacks",
  highKneeJump: "HighKneeJump",
};

export const PHOTO_NAME_MAPPER = {
  frontPose: "frontPose",
  backPose: "backPose",
  sidePose: "sidePose"
};

export const PDF_CREATION_FAILED_MSG =
  "Failed to create PDF. Please try again.";

export const USER_AUTHENTICATION_FAILED_MSG =
  "User authentication failed, please enter valid email and password";

export const VIDEO_UPLOAD_FAILED_MSG =
  "Unable to upload vide, please try again later";

export const EXERCISE_ADD_ERROR = "Failed to add excercise. Please try again later!"

export const EXCERCISE_GET_ERROR = "Failed to get excercises. Please try again later"