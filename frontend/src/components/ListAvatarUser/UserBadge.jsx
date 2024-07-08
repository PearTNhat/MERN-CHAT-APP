import { SmallCloseIcon } from '@chakra-ui/icons';
import './UserAvatar';
import { ChatState } from '../../Context/ChatProvider';
function UserBadge({ user, onClick }) {
    const { selectChat } = ChatState();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#D53F8C',
                height: '24px',
                borderRadius: '2px',
                padding: '0 2px 0 4px',
                margin: '1px',
                cursor: 'pointer',
            }}
            className={`w-user-badge ${
                selectChat?.isGroupChat
                    ? selectChat.groupAdmin.some((u) => u._id === user._id) &&
                      'isAdmin'
                    : ''
            }`}
            onClick={onClick}
        >
            <p style={{ height: ' 24px', lineHeight: '20px' }}>{user.name}</p>
            <i style={{ padding: '1px', display: 'flex', marginTop: '1px' }}>
                <SmallCloseIcon></SmallCloseIcon>
            </i>
        </div>
    );
}

export default UserBadge;
