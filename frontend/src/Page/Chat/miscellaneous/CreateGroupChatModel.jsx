import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { ChatState } from '../../../Context/ChatProvider';
import InputGroup from '../../../components/InputGroup';
import Label from '../../../components/InputGroup/Label';
import Input from '../../../components/InputGroup/Input';
import { useState } from 'react';
import { http } from '../../../utils/http';
import UserAvatar from '../../../components/ListAvatarUser/UserAvatar';
import UserBadge from '../../../components/ListAvatarUser/UserBadge';
import { ChatPageState } from '../../../Context/ChatPageProvider';
function CreateGroupChatModel({ children }) {
    const { user } = ChatState();
    const toast = useToast();
    const { setFetchAgain } = ChatPageState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupName, setGroupName] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleSearch = async (query) => {
        if (!query.trim().length) {
            setSearchResult([]);
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await http.get(
                `api/user/?search=${query}`,
                config,
            );
            setLoading(false);
            setSearchResult((prev) => {
                if (data.length === 0) {
                    return [];
                }
                return data;
            });
        } catch (error) {
            setLoading(false);
            toast({
                title: 'Failed to load user',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const handleSubmit = async () => {
        if (!groupName.trim().length || !selectedUser.length) {
            toast({
                title: 'Please fill out fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: 'Bearer ' + user.token,
                },
            };
            const { data } = await http.post(
                '/api/chat/group',
                {
                    chatName: groupName,
                    users: JSON.stringify([
                        ...selectedUser.map((user) => user._id),
                    ]),
                },
                config,
            );
            toast({
                title: 'Create group successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            setFetchAgain((prev) => !prev);
            setSelectedUser([]);
            onClose();
        } catch (error) {
            toast({
                title: 'Failed to create group chat',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const handleAddGroup = (user) => {
        if (selectedUser.includes(user)) {
            toast({
                title: 'User already exists',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        setSelectedUser((prev) => [...prev, user]);
    };
    const handleDeleteMember = (user) => {
        const newUserSelected = selectedUser.filter((u) => {
            return u._id !== user._id;
        });
        setSelectedUser(newUserSelected);
    };
    return (
        <div>
            {<span onClick={onOpen}>{children}</span>}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent
                    d="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    margin={'auto 0'}
                >
                    <ModalHeader>Create group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDirection="column" width={'100%'}>
                        <InputGroup style={{ marginTop: '8px' }}>
                            <Label>Name</Label>
                            <Input
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup style={{ marginTop: '8px' }}>
                            <Label>Member</Label>
                            <Input
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                }}
                            />
                        </InputGroup>

                        {selectedUser.length > 0 && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    position: 'relative',
                                }}
                                className="line-bottom"
                            >
                                {selectedUser.map((user) => (
                                    <UserBadge
                                        key={user._id}
                                        user={user}
                                        onClick={() => handleDeleteMember(user)}
                                    />
                                ))}
                            </div>
                        )}

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            searchResult.length > 0 &&
                            searchResult
                                .slice(0, 4)
                                .map((user) => (
                                    <UserAvatar
                                        key={user._id}
                                        user={user}
                                        onClick={() => handleAddGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default CreateGroupChatModel;
