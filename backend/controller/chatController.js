const Chat = require("../models/chatModels");
const User = require("../models/userModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json("UserId not sent with request");
  }
  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [{ users: req.user._id }, { users: userId }],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "-password",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const createChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const fetchChat = async (req, res, next) => {
  try {
    let result = await Chat.find({
      users: req.user._id,
    })
      .populate([
        { path: "users", select: "-password" },
        { path: "groupAdmin", select: "-password" },
        {
          path: "latestMessage",
          populate: { path: "sender", select: "-password" },
        },
      ])
      .sort({ updatedAt: -1 });
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const createGroupChat = async (req, res) => {
  const users = JSON.parse(req.body.users);
  if (!req.body.chatName || users.length === 0) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  if (users.length < 2) {
    return res.status(400).send({ message: "Users must be more than 2" });
  } else {
    users.push(req.user);
    try {
      const groupChat = await Chat.create({
        chatName: req.body.chatName,
        groupAdmin: [req.user],
        isGroupChat: true,
        users,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      return res.status(200).json(fullGroupChat);
    } catch (error) {
      return res.status(400).json("Error sever");
    }
  }
};
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res.status(400).send("Can't rename group");
  }
  try {
    const result = await Chat.findOneAndUpdate(
      { _id: chatId },
      { chatName: chatName },
      {
        new: true, // return the new updated
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!result) {
      return res.status(400).json({ message: "Group is not exist" });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const addToGroup = async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || !groupId) {
    res.status(400).json("Can't add user to group");
  }
  try {
    const result = await Chat.findOneAndUpdate(
      { _id: groupId },
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!result) {
      return res.status(400).json({ message: "Group is not exist" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const removeFormGroup = async (req, res) => {
  const { groupId, userId } = req.body;
  if (!groupId || !userId) {
    res.status(400).json({ message: "Can't find user or group" });
  }
  try {
    const groupChat = await Chat.findOne({
      _id: groupId,
    }).populate("groupAdmin", "-password");
    const result = await Chat.findOneAndUpdate(
      {
        _id: groupId,
        groupAdmin: req.user._id,
      },
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: "You are not admin" });
    }
  } catch (error) {}
};
const leaveGroup = async (req, res) => {
  const { groupId } = req.body;
  if (!groupId) {
    res.status(400).json({ message: "Can't find group" });
  }
  try {
    const result = await Chat.findOneAndUpdate(
      {
        _id: groupId,
        users: req.user._id,
      },
      {
        $pull: { users: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: "You are not in this group" });
    }
  } catch (error) {}
};
module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFormGroup,
  leaveGroup,
};
