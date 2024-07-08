import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../../../Context/ChatProvider';
import { http } from '../../../utils/http';
import Input from '../../../components/InputGroup/Input';
import UserAvatar from '../../../components/ListAvatarUser/UserAvatar';
import ChatLoading from '../ChatLoading';
function WrapDrawer({ isOpen, onClose, btnRef }) {
    const toast = useToast();
    const { user, chats, setChats, setSelectChat } = ChatState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const handleSearchUser = async () => {
        if (!search.trim().length) {
            toast({
                title: 'Please enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // den await se bi render lai
            const { data } = await http.get(
                `api/user?search=${search}`,
                config,
            );
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false);

            toast({
                title: 'Failed to load the search user',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await http.post('/api/chat', { userId }, config);
            if (!chats.find((c) => c._id === data._id)) {
                setChats([...chats, data]);
            }
            setSelectChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            setLoadingChat(false);
            toast({
                title: 'Failed to access chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Search user</DrawerHeader>

                <DrawerBody>
                    <Input
                        placeholder="Type here..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    >
                        <button
                            style={{
                                lineHeight: '33.33px',
                                border: '1px solid black',
                                borderRadius: '4px',
                                marginLeft: '4px',
                                padding: '0 4px',
                            }}
                            onClick={handleSearchUser}
                        >
                            Search
                        </button>
                    </Input>
                    {loading ? (
                        <ChatLoading />
                    ) : (
                        <div style={{ margin: '12px 0' }}>
                            {searchResult.map((user) => (
                                <UserAvatar
                                    key={user._id}
                                    user={user}
                                    onClick={() => {
                                        accessChat(user._id);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    {loadingChat && <Spinner ml="auto" />}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

export default WrapDrawer;
