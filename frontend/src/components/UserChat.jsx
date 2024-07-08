import { Avatar, Box, Text } from '@chakra-ui/react';

function UserChat({
    name,
    pic,
    lastName,
    user,
    latestMessage,
    isRead = true,
    hideSender = false,
}) {
    return (
        <Box display={'flex'}>
            <Avatar size="md" name={name} src={pic} />
            <Box ml={'12px'} flex={1}>
                <Text
                    fontWeight={`${isRead ? 400 : 500}`}
                    fontFamily={'inherit'}
                >
                    {name}
                </Text>
                <Text display={'flex'} fontWeight={`${isRead ? 400 : 500}`}>
                    {!hideSender && (
                        <span
                            style={{
                                marginRight: '4px',
                            }}
                        >
                            {latestMessage
                                ? latestMessage.sender._id === user._id
                                    ? 'You:'
                                    : lastName + ':'
                                : ''}
                        </span>
                    )}
                    <Text as={'span'} noOfLines={1}>
                        {latestMessage ? latestMessage.content : ''}
                    </Text>
                </Text>
            </Box>
        </Box>
    );
}

export default UserChat;
