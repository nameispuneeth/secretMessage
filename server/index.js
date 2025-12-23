const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const mongoose = require('mongoose');
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

require("dotenv").config()
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes")
const sendMessageRoutes = require("./routes/sendmsgRoutes")
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error);
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {

    socket.on("join", (userId) => {
        console.log(userId);
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sendmsg", sendMessageRoutes);


app.get('/', (req, res) => {
    res.send('Hello World');
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});