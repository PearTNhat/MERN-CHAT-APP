import { Box, IconButton, Text } from '@chakra-ui/react';
import '../ChatPage.css';
import { ChatState } from '../../../Context/ChatProvider';
import { ArrowBackIcon, ViewIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../../config/ChatLogic';
import ProfileModel from '../miscellaneous/ProfileModel';
import UpdateGroupChatModel from '../miscellaneous/UpdateGroupChatModel';
import SingleChat from './SingleChat/SingleChat';
import { ChatPageState } from '../../../Context/ChatPageProvider';
function ChatBox() {
    const { user, selectChat, setSelectChat } = ChatState();
    const { setFetchAgain } = ChatPageState();
    return (
        <Box
            display={{ base: selectChat ? 'flex' : 'none', md: 'flex' }}
            flexDir={'column'}
            flex={1}
            p={2}
            bg={'white'}
            borderRadius={'lg'}
            borderWidth={'1px'}
        >
            {selectChat ? (
                <>
                    <Box
                        display={'flex'}
                        fontSize={{ base: '25px', md: '20px' }}
                        justifyContent={'space-between'}
                        pb={'8px'}
                    >
                        <IconButton
                            cursor={'pointer'}
                            display={{ base: 'block', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => {
                                setFetchAgain((p) => !p);
                                setSelectChat('');
                            }}
                        />

                        {selectChat?.isGroupChat ? (
                            <>
                                <p> {selectChat?.chatName}</p>
                                <UpdateGroupChatModel>
                                    <ViewIcon fontSize={'16px'} />
                                </UpdateGroupChatModel>
                            </>
                        ) : (
                            <>
                                <p>{getSender(user, selectChat.users)}</p>
                                <ProfileModel
                                    user={getSenderFull(user, selectChat.users)}
                                >
                                    <Text
                                        display={'flex'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        width={{ base: '40px', md: '30px' }}
                                        height={{ base: '40px', md: '30px' }}
                                        backgroundColor="#EDF2F7"
                                        borderRadius="6px"
                                        cursor="pointer"
                                    >
                                        <ViewIcon fontSize={'16px'} />
                                    </Text>
                                </ProfileModel>
                            </>
                        )}
                    </Box>
                    <SingleChat />
                </>
            ) : (
                <p style={{ margin: 'auto', fontSize: '20px' }}>
                    Click on a user to chat
                </p>
            )}
        </Box>
    );
}

export default ChatBox;
