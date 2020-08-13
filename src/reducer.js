export default (state, action) => {
    switch (action.type) {
        case "JOINED":
            const {roomId, userName} = action.payload;

            return {
                ...state,
                joined: true,
                roomId,
                userName
            }

        case "SET_USERS":
            return {
                ...state,
                users: action.payload
            }

        case "SET_MESSAGES":
            return {
                ...state,
                messages: action.payload
            }

        case "SET_CURRENT_USER":
            return {
                ...state,
                currentUser: action.payload
            }
        default: return state;
    }
}
