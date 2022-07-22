import * as redux from "redux";

import rootReducer from "../reducer";

const store = redux.createStore(
	rootReducer
	//   ,composeWithDevTools(applyMiddleware(...middleware))
);
export default store;