import { types } from "../types/types";

const authReducer = (state = {}, action) => {

  switch (action.type) {
    case types.login:
      return {
        logged: true,
        user: {
          ...action.payload
        },
        
      };
      break;

    case types.logout:
      return {
        logged: false,
        user: {},
      };
      break;

    default:
      return state;
      break;
  }
};
export default authReducer;
