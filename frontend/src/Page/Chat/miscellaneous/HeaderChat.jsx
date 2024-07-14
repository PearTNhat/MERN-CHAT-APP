import {
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Tooltip,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import './HeaderChat.css';
import { ChatState } from '../../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import WrapDrawer from '../WrapDrawer';
import { getSender } from '../../../config/ChatLogic';
import { socket } from '../../../socket/connect';
import { http } from '../../../utils/http';
import UserChat from '../../../components/UserChat';
function HeaderChat() {
    const { user, notifications, setNotifications, setSelectChat, setChats } =
        ChatState();
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnSearchRef = useRef();
    const handleLogOut = () => {
        localStorage.removeItem('userInfo');
        setSelectChat(null);
        setNotifications([]);
        setChats([]);
        socket.disconnect();
        navigate('/');
    };
    const handleSelectChat = async (currNotifications) => {
        const config = {
            headers: {
                ' Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        try {
            await http.delete(
                `/api/notification/${currNotifications._id}`,
                config,
            );
            setNotifications(
                notifications.filter((n) => n._id !== currNotifications._id),
            );
            setSelectChat(currNotifications.chat);
        } catch (error) {
            console.log(error);
            toast({
                description: 'Failed to delete notifications',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const loadNotifications = async () => {
        const config = {
            headers: {
                ' Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        try {
            const { data } = await http.get(`/api/notification`, config);
            setNotifications(data);
        } catch (error) {
            toast({
                description: 'Failed to load notifications',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    useEffect(() => {
        loadNotifications();
    }, [user.token]);
    return (
        <header className="header-chat">
            <Tooltip label="Search users" hasArrow placement="bottom">
                <button
                    className="btn-search"
                    ref={btnSearchRef}
                    onClick={onOpen}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <span className="search-text">Search user</span>
                </button>
            </Tooltip>
            <WrapDrawer
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                btnRef={btnSearchRef}
            />
            <h1>CHAT WITH ME</h1>
            <div>
                <Menu>
                    <MenuButton position={'relative'} mr={2}>
                        <BellIcon fontSize={'2xl'} m={1}></BellIcon>
                        {notifications.length > 0 && (
                            <span className="countNotification">
                                {notifications.length}
                            </span>
                        )}
                    </MenuButton>
                    <MenuList>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => {
                                const latestMessage =
                                    notification.chat.latestMessage;
                                let nameSplit;
                                let lastName;
                                if (latestMessage) {
                                    nameSplit =
                                        latestMessage.sender.name.split(' ');
                                    lastName = nameSplit[nameSplit.length - 1];
                                }

                                return (
                                    <MenuItem
                                        key={notification._id}
                                        onClick={() =>
                                            handleSelectChat(notification)
                                        }
                                    >
                                        {!notification.chat.isGroupChat ? (
                                            <UserChat
                                                name={
                                                    notification.chat
                                                        .latestMessage.sender
                                                        .name
                                                }
                                                latestMessage={latestMessage}
                                                user={user}
                                                pic={
                                                    notification.chat
                                                        .latestMessage.sender
                                                        .pic
                                                }
                                                lastName={lastName}
                                                isRead={false}
                                                hideSender={true}
                                            />
                                        ) : (
                                            <UserChat
                                                name={notification.name}
                                                latestMessage={latestMessage}
                                                user={user}
                                                pic={''}
                                                lastName={lastName}
                                                isRead={notification.isRead}
                                                hideSender={false}
                                            />
                                        )}
                                    </MenuItem>
                                );
                            })
                        ) : (
                            <p>No notification</p>
                        )}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar
                            lineHeight="32px"
                            size="sm"
                            cursor="pointer"
                            name={user.name}
                            src={user.pic}
                        />
                    </MenuButton>
                    <MenuList>
                        <ProfileModel user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModel>
                        <MenuDivider />
                        <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </header>
    );
}

export default HeaderChat;
