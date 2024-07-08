/* eslint-disable react-hooks/exhaustive-deps */
import './ChatPage.css';
import { ChatState } from '../../Context/ChatProvider';
import MyChat from './MyChat';
import ChatBox from './ChatBox/ChatBox';
import HeaderChat from './miscellaneous/HeaderChat';
import { ChatPageState } from '../../Context/ChatPageProvider';
import { socket, connectSocket } from '../../socket/connect';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { includeRecipient } from '../../config/ChatLogic';
import { http } from '../../utils/http';
function ChatPage() {
    const { user, setNotifications, selectChat } = ChatState();
    const { setSocketConnected, setFetchAgain } = ChatPageState();
    const navigate = useNavigate();
    const addNotification = async (newMessageReceived) => {
        const config = {
            headers: {
                ' Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        try {
            const { data } = await http.post(
                `/api/notification`,
                { chatId: newMessageReceived.chat._id },
                config,
            );
            console.log(data);
            // kiem tra trung lặp id notification k , nếu k thì thêm mới
            setNotifications((prev) => {
                if (data.exist) {
                    const newNotifications = prev.map((item) => {
                        if (item._id === data.data._id) {
                            return data.data;
                        }
                        return item;
                    });
                    return newNotifications;
                } else {
                    return [...prev, data.data];
                }
            });
        } catch (error) {}
    };
    useEffect(() => {
        if (user == null) {
            navigate('/');
            return;
        }
        connectSocket();
        socket.emit('set-up', user);
        //nhân tín hiệu kết nối thành công (1)
        socket.on('connected', () => {
            setSocketConnected(true);
        });
        socket.on('message received', async (newMessageReceived) => {
            // notification
            const isRecipient = includeRecipient(
                newMessageReceived.chat.users,
                user,
            );
            if (
                (!selectChat ||
                    selectChat._id !== newMessageReceived.chat._id) &&
                isRecipient
            ) {
                await addNotification(newMessageReceived);
            }
        });
    }, [user?._id]);
    return (
        <div className="container-chat">
            {user && <HeaderChat />}
            <div className="body-chat">
                {user && <MyChat />}
                {user && <ChatBox />}
            </div>
        </div>
    );
}

export default ChatPage;
