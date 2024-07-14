/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const ChatContext = createContext({});
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('userInfo'));
    });
    const [selectChat, setSelectChat] = useState();
    const [notifications, setNotifications] = useState([]);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);
    }, [navigate]);
    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectChat,
                setSelectChat,
                chats,
                setChats,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
const ChatState = () => {
    return useContext(ChatContext);
};
export { ChatProvider, ChatState };
