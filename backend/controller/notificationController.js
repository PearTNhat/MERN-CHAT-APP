const Notification = require("../models/notificationModel");

const fetchNotification = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId })
      .populate([
        {
          path: "chat",
          select: "-createdAt -updateAt",
          populate: {
            path: "latestMessage",
            select: "content sender",
            populate: { path: "sender", select: "-password" },
          },
        },
      ])
      .sort({ updatedAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
const createOrUpdateNotification = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;
    let notification;
    let exist;
    const existNotification = await Notification.findOne({ user: userId });
    if (existNotification) {
      exist = true;
      notification = await Notification.findOneAndUpdate(
        { user: userId },
        {
          chat: chatId,
        },
        { new: true }
      ).populate([
        {
          path: "chat",
          select: "-createdAt -updateAt",
          populate: {
            path: "latestMessage",
            select: "content sender",
            populate: { path: "sender", select: "-password" },
          },
        },
      ]);
    } else {
      exist = false;
      notification = await Notification.create({
        user: userId,
        chat: chatId,
      });
      notification = await notification.populate([
        {
          path: "chat",
          select: "-createdAt -updateAt",
          populate: {
            path: "latestMessage",
            select: "content sender",
            populate: { path: "sender", select: "-password" },
          },
        },
      ]);
    }
    return res.status(200).json({ data: notification, exist });
  } catch (error) {
    console.log(error);
  }
};
const deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndDelete(notificationId);
    return res.status(200).json("delete notification success");
  } catch (error) {
    next(error);
  }
};
// const updateReadNotification = async (req, res, next) => {
//   try {
//     const notificationId = req.params.id;
//     const notification = await Notification.findByIdAndUpdate(
//       { _id: notificationId },
//       { isRead: true },
//       { new: true }
//     );
//     return res.status(200).json(notification);
//   } catch (error) {
//     next(error);
//   }
// };
module.exports = {
  fetchNotification,
  deleteNotification,
  createOrUpdateNotification,
};
