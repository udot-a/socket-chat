const express = require("express");
const path = require("path");


const app = express();

const server = require("http").Server(app);

const io = require("socket.io")(server);

const rooms = new Map();

app.use(express.json());

app.get("/rooms/:id", function (req, res) {
    const roomId = req.params.id;
    const obj = rooms.has(roomId)
        ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages").values()]
        }
        : {users:[], messages: []}
    res.json(obj);
});

app.post("/rooms", (req, res) => {
    console.log(req.body);
    const {roomId, userName} = req.body;

    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ["users", new Map()],
            ["messages", []]
        ]))
    }
    res.send();
});

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "build", "index.html"));
    });
}


io.on("connection", socket => {
    socket.on("ROOM:JOIN", ({ roomId, userName }) => {
        socket.join(roomId);

        rooms.get(roomId).get("users").set(socket.id, userName);
        const users = [...rooms.get(roomId).get("users").values()];

        io.sockets.in(roomId).emit("ROOM:SET_USERS", users);
    });

    socket.on("ROOM:SEND_MESSAGE", ({ text, userName, roomId }) => {
        rooms.get(roomId).get("messages").push({text, userName});
        const messages = [...rooms.get(roomId).get("messages").values()];

        io.sockets.in(roomId).emit("ROOM:SET_MESSAGES", messages);
    });

    socket.on("disconnect", () => {
        rooms.forEach((value, roomId) => {
            if (value.get("users").delete(socket.id)) {
                const users = [...value.get("users").values()];

                socket.to(roomId).broadcast.emit("ROOM:SET_USERS", users);
            }
        })
   });

    console.log("socket connected", socket.id)
})

server.listen(5000, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log("Server started...")
});
