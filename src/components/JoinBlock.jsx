import React, {useCallback,  useState} from "react";
import axios from "axios";

export default ({onLogin}) => {
    const [formData, setFormdata] = useState({
        roomId: "",
        userName: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const {roomId, userName} = formData;

    const handleInput = ({target: { name, value }}) => {
        setFormdata(formData => ({
            ...formData,
            [name]: value
        }))
    }

    let handleClick = useCallback( () => {
        if (!roomId || !userName) {
            console.warn("Data not entered!!!");
            return;
        }
        setIsLoading(true);

        const obj = {roomId , userName };

        axios
            .post("/rooms", obj)
            .then(() => {
                onLogin(obj);
            });
    }, [onLogin, roomId, userName]);

    return (
        <div className={"block"}>
            <input
                name={"roomId"}
                type="text"
                placeholder={"Room ID"}
                value={roomId}
                onChange={handleInput}
            />

            <input
                name={"userName"}
                type="text"
                placeholder={"YOUR NAME"}
                value={userName}
                onChange={handleInput}
            />

            <button
                disabled={isLoading}
                className={"btn-input"}
                onClick={handleClick}
            >
                {isLoading ? "ВХОД..." : "ВОЙТИ"}
            </button>

        </div>

    );
}
