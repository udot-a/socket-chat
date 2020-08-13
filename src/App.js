import React, {useEffect, useReducer} from 'react';
import './App.css';
import JoinBlock from "./components/JoinBlock";
import socket from "./socket";
import reducer from "./reducer";
import Chat from "./components/Chat";
import * as axios from "axios";

function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: []
    });

    const onLogin = async obj => {
        dispatch({
            type: "JOINED",
            payload: obj
        });

        socket.emit("ROOM:JOIN", obj);

        const {data: { users, messages }} = await axios
            .get(`/rooms/${obj.roomId}`);


        dispatch({
            type: "SET_USERS",
            payload: users
        });

        dispatch({
            type: "SET_MESSAGES",
            payload: messages
        });

    }

    const userAction = users => {
        dispatch({
            type: "SET_USERS",
            payload: users
        })
    }

    useEffect(() => {
        socket.on("ROOM:SET_USERS", userAction);

        socket.on("ROOM:SET_MESSAGES", (payload) =>
            dispatch({
            type: "SET_MESSAGES",
            payload
        }));

    }, []);

    return (
        <div className="wrapper">
            {!state.joined ? <JoinBlock onLogin={onLogin}/> : <Chat {...state}/>}
        </div>
    );
    }

export default App;
