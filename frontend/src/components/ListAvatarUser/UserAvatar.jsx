import { Avatar, Box } from '@chakra-ui/react';
import './UserAvatar.css';
function UserAvatar({ user, onClick }) {
    return (
        <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            borderRadius="6px"
            p={2}
            _hover={{ backgroundColor: '#39B1AE', color: 'white' }}
            onClick={onClick}
        >
            <Avatar
                lineHeight="32px"
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            />
            <div
                className="w-info"
                style={{ width: '200px', marginLeft: '12px' }}
            >
                <p className="user-email">{user.name}</p>
                <p className="w-email">
                    <b>Email: </b>
                    <span className="user-email"> {user.email}</span>
                </p>
            </div>
        </Box>
    );
}

export default UserAvatar;
