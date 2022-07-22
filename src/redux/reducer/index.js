import * as redux from "redux";

import ThemeToggleReducer from "./ThemeToggler";
import LoginReducer from "./LoginReducer";
import MenuTogglerReducer from "./MenuToggler";
import { Notofications } from "./Notification";
import LoadingReducer from "./LoadingReducer";
import ToastReducer from "./Toast";

const rootReducer = redux.combineReducers({
	theme: ThemeToggleReducer,
	user: LoginReducer,
	menu: MenuTogglerReducer,
	tokens: Notofications,
	toast: ToastReducer,
	loading: LoadingReducer,
});

export default rootReducer;