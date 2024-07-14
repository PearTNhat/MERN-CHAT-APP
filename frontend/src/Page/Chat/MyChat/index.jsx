/* eslint-disable react-hooks/exhaustive-deps */
import { http } from '../../../utils/http';
import '../ChatPage.css';
import { Avatar, Box, Button, Stack, useToast, Text } from '@chakra-ui/react';
import { ChatState } from '../../../Context/ChatProvider';
import { useEffect } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import { getSenderFull } from '../../../config/ChatLogic';
import CreateGroupChatModel from '../miscellaneous/CreateGroupChatModel';
import { ChatPageState } from '../../../Context/ChatPageProvider';
import UserChat from '../../../components/UserChat';
function MyChat() {
    const toast = useToast();
    const { user, chats, setChats, selectChat, setSelectChat, notifications } =
        ChatState();
    const { fetchAgain } = ChatPageState();
    const fetchChat = async () => {
        if (user.length === 0 || !user) return;
        try {
            const { data } = await http.get('/api/chat', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            console.log(data);
            setChats(data);
        } catch (error) {
            toast({
                title: 'Failed to fetch chat',
                description: 'Failed to load chat',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    useEffect(() => {
        fetchChat();
    }, [user.token, fetchAgain, notifications]);
    return (
        <Box
            display={{ base: selectChat ? 'none' : 'flex', md: 'flex' }}
            p={3}
            flexDir={'column'}
            bg="white"
            w={{ base: '100%', md: '35%' }}
            borderRadius={'lg'}
            borderWidth={'1px'}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '18px', md: '15px' }}
                display={'flex'}
                w="100%"
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                My Chats
                <CreateGroupChatModel>
                    <Button
                        fontSize={{ base: '17px', md: '14px' }}
                        fontWeight="300"
                        rightIcon={<AddIcon />}
                    >
                        New group chat
                    </Button>
                </CreateGroupChatModel>
            </Box>
            <Box
                display={'flex'}
                flexDir={'column'}
                bg={'#F8F8F8'}
                width={'100%'}
                height="100%"
                overflow={'hidden'}
            >
                {chats ? (
                    <Stack overflowY="scroll" py={'6px'}>
                        {chats.map((chat) => {
                            const friend = getSenderFull(user, chat.users);
                            const latestMessage = chat.latestMessage;
                            let nameSplit;
                            let lastName;
                            if (latestMessage) {
                                nameSplit =
                                    latestMessage.sender.name.split(' ');
                                lastName = nameSplit[nameSplit.length - 1];
                            }
                            return (
                                <Box
                                    cursor={'pointer'}
                                    bg={
                                        selectChat?._id === chat?._id
                                            ? '#38B2AC'
                                            : 'E8E8E8'
                                    }
                                    color={
                                        selectChat?._id === chat?._id
                                            ? 'white'
                                            : 'black'
                                    }
                                    padding={'3px 5px'}
                                    key={chat._id}
                                    borderRadius={'lg'}
                                    onClick={() => setSelectChat(chat)}
                                >
                                    {!chat.isGroupChat ? (
                                        <UserChat
                                            name={friend.name}
                                            latestMessage={latestMessage}
                                            user={user}
                                            pic={friend.pic}
                                            lastName={lastName}
                                        />
                                    ) : (
                                        <UserChat
                                            name={chat.chatName}
                                            latestMessage={latestMessage}
                                            user={user}
                                            pic={''}
                                            lastName={lastName}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
}

export default MyChat;
