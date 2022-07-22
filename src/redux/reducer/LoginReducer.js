import jwt_decode from "jwt-decode";

function getDecodedValue() {
    try {
        if (localStorage.hasOwnProperty("eco_token")) {
            const decoded = jwt_decode(
                JSON.parse(localStorage.getItem("eco_token"))
            );
            // const currentTime = Date.now() / 1000;
            // if (decoded.exp < currentTime) {
            // 	return {
            // 		...state,
            // 		isAuthenticated: false,
            // 		user: null
            // 	}
            // }
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

let initialState = {
    user: getDecodedValue(),
    isloggedin: JSON.parse(localStorage.getItem("isloggedin")) || false,
};

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            console.log("came to login reducer");
            localStorage.setItem("eco_token", action.data);
            localStorage.setItem("isloggedin", JSON.stringify(true));
            return Object.assign({}, state, {
                user: null,
                isloggedin: true,
            });
        case "LOGOUT_USER":
            localStorage.removeItem("eco_token");
            localStorage.setItem("isloggedin", JSON.stringify(false));
            return Object.assign({}, state, {
                user: null,
                isloggedin: false,
            });
        default:
            return state;
    }
};

export default LoginReducer;
