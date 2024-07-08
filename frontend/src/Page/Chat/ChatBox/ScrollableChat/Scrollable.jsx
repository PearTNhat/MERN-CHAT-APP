import ScrollableFeed from 'react-scrollable-feed';
import {
    isLastMessage,
    isSameUser,
    theSameSender,
    theSameSenderMargin,
} from '../../../../config/ChatLogic';
import { ChatState } from '../../../../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';
function ScrollableChat({ message }) {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {message.map((m, i) => (
                <div
                    key={m._id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: `${
                            isSameUser(message, m, i) ? '3px' : '10px'
                        }`,
                    }}
                >
                    {(theSameSender(message, m, i, user._id) ||
                        isLastMessage(message, i, user._id)) && (
                        <Tooltip
                            hasArrow
                            label={m.sender.name}
                            placement="bottom-start"
                        >
                            <Avatar
                                m={'2px'}
                                size="sm"
                                cursor="pointer"
                                name={m.sender.name}
                                src={m.sender.pic}
                            />
                        </Tooltip>
                    )}
                    <span
                        style={{
                            backgroundColor: `${
                                user._id === m.sender._id
                                    ? '#BEE3F8'
                                    : '#B9F5D0'
                            }`,
                            height: '32px',
                            maxWidth: 'max-content',
                            width: '75%',
                            padding: '5px 8px',
                            borderRadius: '14px',
                            marginLeft: `${theSameSenderMargin(
                                message,
                                m,
                                i,
                                user._id,
                            )}`,
                        }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    );
}

export default ScrollableChat;
