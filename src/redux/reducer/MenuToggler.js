let initialState = {
	is_open: false,
	is_nav_menu_shown: false,
	show_Search: false,
	searchFeild: ""
};

const MenuTogglerReducer = (state = initialState, action) => {
	switch (action.type) {
		case "TOGGLE_MENU":
			return Object.assign({}, state, {
				is_open: !state.is_open
			})
		case "NAV_MENU":
			return Object.assign({}, state, {
				is_nav_menu_shown: !state.is_nav_menu_shown
			})
		case "SEARCH_BAR":
			return Object.assign({}, state, {
				show_Search: !state.show_Search
			})
		case "SEARCH_FEILD":
			return Object.assign({}, state, {
				searchFeild: action.data
			})
		default:
			return state;
	}
}
export default MenuTogglerReducer;