import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { ChatState } from '../../../Context/ChatProvider';
import { ViewIcon } from '@chakra-ui/icons';

function ProfileModel({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <div>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <button>
                    <ViewIcon />
                </button>
            )}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent
                    d="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <ModalHeader>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDirection="column">
                        <span
                            style={{ display: 'block', marginBottom: '12px' }}
                        >
                            <img
                                style={{
                                    display: 'block',
                                    borderRadius: '50%',
                                    width: '200px',
                                    height: '200px',
                                    margin: '0 auto',
                                }}
                                src={user.pic}
                                alt={user.pic}
                            />
                        </span>
                        <p
                            style={{
                                margin: ' 12px 0',
                                fontSize: '20px',
                            }}
                        >
                            {user.email}
                        </p>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ProfileModel;
