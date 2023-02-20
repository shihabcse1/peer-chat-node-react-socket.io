const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`New User Connected id: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User Id: ${socket.id} Room name: ${data}`);
    });

    socket.on("send_message", (data) => {
        console.log("send message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(5000, () => {
    console.log("Server Running at Port 5000");
});
