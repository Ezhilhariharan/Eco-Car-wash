const initialState = {
  text: "",
  time: "",
};
const ToastReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ShowToast":
      console.log("ShowToast", action);
      return Object.assign({}, state, {
        ...action,
        text: action?.text,
        time: action?.time,
      });
    default:
      return state;
  }
};

export default ToastReducer;