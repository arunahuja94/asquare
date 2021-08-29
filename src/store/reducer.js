const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: false,
  userReg: false,
};
const appReducer = (initialState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...initialState,
        userToken: action.token,
        isLoading: false,
      };
    case 'RESTORE_REG':
      return {
        ...initialState,
        userReg: action.token,
        isLoading: false,
      };
    case 'SIGN_UP':
      return {
        ...initialState,
        userReg: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...initialState,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...initialState,
        isSignout: true,
        userToken: false,
      };
  }
};
export {appReducer, initialState};
