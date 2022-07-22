
let initialState = {
	is_dark: JSON.parse(localStorage.getItem('is_dark')) || false,
};

const ThemeToggleReducer = (state = initialState, action) => {
	switch (action.type) {
		case "TOGGLE_THEME":
			document.documentElement.classList.add('transistion');
			window.setTimeout(() => {
				document.documentElement.classList.remove('transistion')
			}, 500);
			localStorage.setItem('is_dark', JSON.stringify(!state.is_dark));
			return Object.assign({}, state, {
				is_dark: !state.is_dark
			})
		default:
			return state;
	}

};

export default ThemeToggleReducer;