import { combineReducers } from "redux";
import authenticationReducer from "./Authentication";

const allReducers = combineReducers({
  authenticationReducer,
  // Viết thêm các reducer ở đây
});

export default allReducers;