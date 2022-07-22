const initialState = {
    loadingState: "",
};
const LoadingReducer = (state = initialState, action) => {
    // console.log("action", action)
    switch (action.type) {
        case "Loading":
            // console.log("action", action)
            return Object.assign({}, state, {
                ...action.data,
                loadingState: action.loadingState,
            });
        default:
            return state;
    }
};
export default LoadingReducer