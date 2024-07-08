const Chat = require("../models/chatModels");
const Message = require("../models/messageModule");

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    return res.status(400).json("Invalid data pass into request");
  }
  try {
    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    let message = await Message.create(newMessage);
    message = await message.populate([
      { path: "sender", select: "name pic" },
      { path: "chat", populate: { path: "users", select: "name pic email" } },
    ]);
    await Chat.findByIdAndUpdate({ _id: chatId }, { latestMessage: message });
    return res.status(200).json(message);
  } catch (error) {
    res.status(500).json("Can not send message");
  }
};
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json("Can not get all messages");
  }
};
module.exports = { sendMessage, allMessages };
