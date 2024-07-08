export const getSender = (loginUser, otherUser) => {
    return loginUser._id === otherUser[0]._id
        ? otherUser[1].name
        : otherUser[0].name;
};
const includeRecipient = (users, user) => {
    return users.find((u) => {
        return u._id === user._id;
    });
};
export const getSenderFull = (loginUser, otherUser) => {
    return loginUser._id === otherUser[0]._id ? otherUser[1] : otherUser[0];
};
export const theSameSender = (message, m, i, userId) => {
    return (
        // current U id !== next U id
        //current U id !== current U id
        i < message.length - 1 &&
        m.sender._id !== message[i + 1].sender._id &&
        m.sender._id !== userId
    );
};
const isLastMessage = (message, i, userId) => {
    return (
        i === message.length - 1 &&
        message[message.length - 1].sender._id !== userId &&
        message[message.length - 1].sender._id
    );
};
const theSameSenderMargin = (message, m, i, userId) => {
    if (m.sender._id === userId) {
        return 'auto';
    }
    if (i < message.length - 1 && message[i + 1].sender._id === m.sender._id) {
        return '33px';
    } else if (
        i > 0 &&
        (isLastMessage(message, i, userId) ||
            message[i - 1].sender._id === m.sender._id) &&
        message[i - 1].sender._id === m.sender._id
    ) {
        return 0;
    }
};
const isSameUser = (message, m, i) => {
    return i > 0 && message[i - 1].sender._id === m.sender._id;
};
export { includeRecipient, theSameSenderMargin, isLastMessage, isSameUser };
