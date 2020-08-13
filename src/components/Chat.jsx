import React, {useEffect, useRef, useState} from "react";
import "./chat.css";
import socket from "../socket";

export default ({ users, messages, userName, roomId }) => {
    const messageBlock = useRef(null);

    const [text, setText] = useState("");

    const handleChange = ({target: { value }}) => {
        setText(value)
    }

    const scrollBottom = () => {
        if (messageBlock && messageBlock.current) {
            messageBlock.current.scrollTo(0, messageBlock.current.scrollHeight)
        }
    }

    useEffect(() => {
        scrollBottom();
    }, [messages])

    const handleSubmit = e => {
        e.preventDefault();
        if (!text) {
            return;
        }
        const obj = {
            text,
            roomId,
            userName
        }
        socket.emit("ROOM:SEND_MESSAGE", obj);

        setText("");
    }

    return (
        <div className={"wrapper"}>
            <div className={"chat-users"} >
                <b>{`КОМНАТА ${roomId}`}</b>
                <hr/>
                <b>
                    {`Онлайн (${users.length}):`}
                </b>

                <ul>
                    {users.map((user, key) => {
                        return (
                            <li
                                key={key}
                                style={{color: user === userName ? "tomato" : "blue"}}
                            >
                                {user}
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className={"chat-messages"}>
                <div className={"messages"}  ref={messageBlock}>
                    {
                        messages.map((message, key) => (
                            <div
                                className={"message"}
                                style={{alignSelf: message.userName === userName ? "flex-start" : "flex-end"}}
                                key={key+message.userName}
                                // ref={messageBlock}
                            >
                                <p
                                    style={{backgroundColor: message.userName === userName ? "tomato" : "blue"}}
                                >
                                    {message.text}
                                </p>

                                <div>
                                    <small
                                        style={{color: message.userName === userName ? "tomato" : "blue"}}
                                    >
                                        {message.userName}
                                    </small>
                                </div>
                            </div>
                        ))
                    }
                </div>



                <form onSubmit={handleSubmit}>
                    <textarea
                        name="text"
                        rows="3"
                        value={text}
                        placeholder={"Напишите свое сообщение..."}
                        onChange={handleChange}
                    >

                    </textarea>

                    <button
                        type={"submit"}
                        disabled={!text}
                    >
                        {"Отправить"}
                    </button>
                </form>

            </div>

        </div>
    );
}
