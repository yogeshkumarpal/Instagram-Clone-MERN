require("dotenv").config();
const app = require("./src/app");
const socketIo = require("socket.io");
const http = require("http");
const cacheClient = require("./src/services/cache.services");
const connectDB = require("./src/config/db/db");
const server = http.createServer(app);
const cors = require("cors");
const MessageModel = require("./src/models/message.model");


app.use(
  cors({
    origin: [
      "https://instagram-clone-mern-2ews.onrender.com",
    ],
    credentials: true,
  })
);

connectDB();

const io = socketIo(server, {
  cors: {
    origin: [
      
      "https://instagram-clone-mern-2ews.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

cacheClient.on("connect", () => {
  console.log("Redis connected successfully");
});

cacheClient.on("error", (error) => {
  console.log("Error connecting redis->", error);
});

const onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.emit("take_SID", socket.id);

  socket.on("join-room", async (chatUsers) => {
    socket.join(chatUsers.roomId);

    if (chatUsers.socket_id) {
      onlineUsers.push(chatUsers.socket_id);
    }

    let restMessages = await MessageModel.find({ room_id: chatUsers.roomId });

    console.log(" user join with room id", chatUsers.roomId);

    socket.emit("load-old-messages", restMessages);
  });

  socket.on("send-msg", async (msg) => {
    console.log("incoming-msg", msg);

    let newMessage = await MessageModel.create({
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      room_id: msg.roomId,
      content: msg.text,
    });

    io.to(msg.roomId).emit("receive-msg", newMessage);
    socket.emit("receive-msg", newMessage);
  });

  socket.on("chat", (msg) => {
    console.log("msg received from client ->", msg);
    socket.emit("chat", "Badhiya hai bhai");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
server.listen(3000, () => {
  console.log("server is running on port 3000");
});
