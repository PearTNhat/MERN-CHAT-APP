import { ViewIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import UserBadge from '../../../components/ListAvatarUser/UserBadge';
import { useState } from 'react';
import { ChatState } from '../../../Context/ChatProvider';
import { http } from '../../../utils/http';
import UserAvatar from '../../../components/ListAvatarUser/UserAvatar';
import { ChatPageState } from '../../../Context/ChatPageProvider';
function UpdateGroupChatModel({ children }) {
    const toast = useToast();
    const { user, selectChat, setSelectChat } = ChatState();
    const { setFetchAgain } = ChatPageState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [renameGroup, setRenameGroup] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const handleRename = async () => {
        if (!renameGroup) {
            toast({
                title: 'Please enter a name',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            setLoading(true);
            const { data } = await http.put(
                'api/chat/rename',
                {
                    chatId: selectChat._id,
                    chatName: renameGroup,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + user.token,
                    },
                },
            );
            setRenameGroup('');
            setFetchAgain((prev) => !prev);
            setSelectChat(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Failed to rename',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const handleSearch = async (query) => {
        if (!query.trim().length) {
            setSearchResult([]);
            return;
        }
        try {
            setLoadingSearch(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await http.get(
                `api/user/?search=${query}`,
                config,
            );
            setLoadingSearch(false);
            setSearchResult((prev) => {
                if (data.length === 0) {
                    return [];
                }
                return data;
            });
        } catch (error) {
            setLoadingSearch(false);
            toast({
                title: 'Failed to load user',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const handleAddUser = async (userId) => {
        const isDuplicateUser = selectChat.users.some((u) => u._id === userId);
        if (isDuplicateUser) {
            toast({
                title: 'User already added',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        const isAdmin = selectChat.groupAdmin.some((u) => u._id === user._id);
        if (!isAdmin) {
            toast({
                title: 'You are not admin',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            setLoading(true);
            const { data } = await http.put(
                'api/chat/add-group',
                {
                    userId,
                    groupId: selectChat._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            setLoading(false);
            setSelectChat(data);
        } catch (error) {
            setLoading(false);
        }
    };
    const handleRemoveUser = async (userId) => {
        const isAdmin = selectChat.groupAdmin.some((u) => u._id === user._id);
        if (!isAdmin && userId !== user._id) {
            toast({
                title: 'You are not admin',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            setLoading(true);
            const { data } = await http.put(
                'api/chat/group-remove',
                {
                    groupId: selectChat._id,
                    userId,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + user.token,
                    },
                },
            );
            userId === user.id ? setSelectChat('') : setSelectChat(data);
            setFetchAgain((prev) => !prev);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast({
                title: 'Failed to remove user',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
    };
    const handleLeave = async (userId) => {
        try {
            setLoading(true);
            await http.put(
                'api/chat/leave-group',
                {
                    groupId: selectChat._id,
                    userId,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + user.token,
                    },
                },
            );
            setSelectChat('');
            setFetchAgain((prev) => !prev);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast({
                title: 'Failed to leave group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
    };
    return (
        <>
            <Text
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                width={{ base: '40px', md: '30px' }}
                height={{ base: '40px', md: '30px' }}
                backgroundColor="#EDF2F7"
                borderRadius="6px"
                cursor="pointer"
                onClick={onOpen}
            >
                {children}
            </Text>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={'center'} fontSize={'20px'}>
                        {selectChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={'flex'} flexWrap={'wrap'}>
                            {selectChat.users.map((u, i) => {
                                return (
                                    <UserBadge
                                        key={u._id}
                                        user={u}
                                        onClick={() => handleRemoveUser(u._id)}
                                    />
                                );
                            })}
                        </Box>
                        <FormControl display={'flex'} p={'8px 0'}>
                            <Input
                                placeholder="Enter the name you want to rename"
                                value={renameGroup}
                                onChange={(e) => setRenameGroup(e.target.value)}
                            />
                            <Button
                                colorScheme="whatsapp"
                                onClick={handleRename}
                                ml={2}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add user to group"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box mt={1} maxHeight={'192px'} overflow={'auto'}>
                            {loadingSearch ? (
                                <Spinner fontSize="lg" />
                            ) : (
                                searchResult.map((user) => (
                                    <UserAvatar
                                        key={user._id}
                                        user={user}
                                        onClick={() => handleAddUser(user._id)}
                                    />
                                ))
                            )}
                        </Box>
                    </ModalBody>

                    <ModalFooter position={'relative'}>
                        {loading && (
                            <Spinner
                                position={'absolute'}
                                top="34%"
                                left={'38%'}
                            />
                        )}
                        <Button
                            colorScheme="red"
                            mr={3}
                            onClick={() => {
                                handleLeave(user._id);
                                onClose();
                            }}
                        >
                            Leave group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModel;
