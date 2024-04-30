export const ROLE = {
  CANDIDATE: "Candidate",
  RECRUITER: "Recruiter",
};
export const PLACES_ANYPLACE_ID = 53;
export const MAX_UPLOAD_SIZE = 1024 * 1024 * 2;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
export const CREATE_COMPANY_STEPS = 3;
export const CREATE_OFFER_STEPS = 7;

export const API_ROUTES = {
  SIGN_IN: "api/auth/signin",
  SIGN_UP: "api/auth/signup",
  GET_USER: "api/auth/user",
  GET_COMPANY_OFFERS: "api/offers/mycompany",
  GET_COMPANY_OFFER: "api/offer/mycompany",
  DELETE_OFFER: "api/offer/delete",
  PUBLISH_OFFER: "api/offer/publish",
  UNPUBLISH_OFFER: "api/offer/unpublish",
  CREATE_OFFER: "api/offer/create",
  UPDATE_OFFER: "api/offer/update",
  CREATE_COMPANY: "api/company/create",
  UPDATE_COMPANY: "api/company/update",
  GET_ATTENDANCES: "api/attendances",
  GET_SCHEDULES: "api/schedules",
  GET_POSITIONS: "api/positions",
  GET_SKILLS: "api/skills",
  GET_PLACES: "api/places",
};
