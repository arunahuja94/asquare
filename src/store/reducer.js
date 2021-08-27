const appReducer = (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'RESTORE_REG':
          return {
            ...prevState,
            userReg: action.token,
            isLoading: false,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            userReg: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    }

    const initialState= {
        isLoading: true,
        isSignout: false,
        userToken: null,
        userReg:null
      };

  export {appReducer, initialState};