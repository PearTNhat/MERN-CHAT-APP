/* eslint-disable react-hooks/exhaustive-deps */
import { http } from '../../../../utils/http';
import { Box, FormControl, Input, Spinner, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ChatState } from '../../../../Context/ChatProvider';
import ScrollableChat from '../ScrollableChat/Scrollable';
import Lottie from 'react-lottie';
import animationData from '../../../../animation/typing.json';
import { ChatPageState } from '../../../../Context/ChatPageProvider';
import { socket } from '../../../../socket/connect';
let selectedChatCompare;
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};
const TYPING_TIME = 3000;
function SingleChat() {
    const toast = useToast();
    const { user, selectChat, chats } = ChatState();
    const { setFetchAgain, socketConnected } = ChatPageState();
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [message, setMessage] = useState([]);
    const [, setTimeOutTyping] = useState(null);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [userTyping, setUserTyping] = useState('');
    // socket
    useEffect(() => {
        socket.on('typing', ({ user }) => {
            setIsTyping(true);
            setUserTyping(user);
        });
        socket.on('stop typing', () => {
            setIsTyping(false);
        });
    }, []);
    const fetchMessage = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    ' Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await http.get(
                `/api/message/${selectChat._id}`,
                config,
            );

            setMessage(data);
            setLoading(false);
            socket.emit('join room', selectChat._id);
        } catch (error) {
            console.log(error);
        }
    };
    const sendMessage = async (e) => {
        if (e.key === 'Enter') {
            socket.emit('stop typing', selectChat._id);
            if (newMessage) {
                const config = {
                    headers: {
                        ' Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                try {
                    setNewMessage('');
                    const { data } = await http.post(
                        `/api/message`,
                        {
                            chatId: selectChat._id,
                            content: newMessage,
                        },
                        config,
                    );

                    socket.emit('send message', data);
                    // khẳ năng là load lại tin nhắn ở my chat
                    if (chats[0]._id !== selectChat._id) {
                        setFetchAgain((p) => !p);
                    }
                    setMessage((prev) => [...prev, data]);
                } catch (error) {
                    toast({
                        description: 'Failed to send chat',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right',
                    });
                }
            }
        }
    };
    const typingHandler = async (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit('typing', { room: selectChat._id, user: user });
            setTimeOutTyping((prev) => {
                clearTimeout(prev);
                return setTimeout(() => {
                    setTyping(false);
                    socket.emit('stop typing', selectChat._id);
                }, TYPING_TIME);
            });
        }
    };
    useEffect(() => {
        fetchMessage();
        selectedChatCompare = selectChat;
    }, [selectChat]);
    // socket
    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            console.log('vao re');
            if (
                selectedChatCompare &&
                selectedChatCompare._id === newMessageReceived.chat._id
            ) {
                console.log('set message');
                setMessage((prev) => [...prev, newMessageReceived]);
            }
        });
        return () => {
            socket.off('message received');
        };
    }, [selectChat]);
    return (
        <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            bg={'#E8E8E8'}
            height={'100%'}
            w={'100%'}
            overflowY={'hidden'}
            borderRadius={'lg'}
            p={3}
        >
            {loading ? (
                <Spinner
                    size={'xl'}
                    w={20}
                    h={20}
                    margin={'auto'}
                    display={'block'}
                />
            ) : (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        overflowY: 'auto',
                    }}
                >
                    <ScrollableChat message={message} />
                </div>
            )}
            {/* them fetch chat update group */}
            <FormControl onKeyDown={sendMessage} isRequired>
                {isTyping ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ margin: '4px' }}>
                            <Lottie
                                options={defaultOptions}
                                height={20}
                                width={40}
                            />
                        </div>
                        <p
                            style={{
                                fontSize: '12px',
                                opacity: '0.8',
                            }}
                        >{`${userTyping.name} is composing a  message`}</p>
                    </div>
                ) : (
                    ''
                )}
                <Input
                    variant="filled"
                    bg={'#E0E0E0'}
                    placeholder="Enter a message ..."
                    mt={'8px'}
                    value={newMessage}
                    onChange={typingHandler}
                />
            </FormControl>
        </Box>
    );
}

export default SingleChat;
