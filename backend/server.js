const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const notificationRoute = require("./routes/notificationRoute");
const authRoute = require("./routes/authRoute");
const Message = require("./models/messageModule");
require("./passport");
const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
connectDB();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoute);
app.use("/api/auth", authRoute);

// ----------DEPLOYMENT------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "public")));
}
app.get("/", (req, res) => {
  Message.deleteMany({ sender: "644687d0bde9f202c2a562d6" })
    .then(() => {
      res.json({ message: "Messages deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
const sever = app.listen(PORT, () =>
  console.log(`listening on ${PORT}`.yellow.bold)
);
const io = require("socket.io")(sever, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket io");
  socket.on("set-up", (userData) => {
    // tạo 1 room mới
    socket.join(userData._id);
    //phát tín hiệu kết nối thành công (1)
    socket.emit("connected", "kiki");
  });

  socket.on("join room", (room) => {
    socket.join(room);
  });

  socket.on("typing", ({ room, user }) => {
    socket.to(room).emit("typing", { user });
  });
  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });
  socket.on("send message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users is not defined");
    // socket.to(chat._id).emit("message received", newMessageReceived);
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("set-up", () => {
    console.log("DISCONNECT");
    socket.leave(userData._id);
  });
});
