import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';
import { http } from '../../utils/http';
import { Box, Spinner, useToast } from '@chakra-ui/react';

function OtherLogin() {
    const toast = useToast();
    const { googleId, tokenLogin } = useParams();
    const { user, setUser } = ChatState();
    useEffect(() => {
        const loginWithGoogle = async () => {
            try {
                const { data } = await http.post(`/api/auth/login-success`, {
                    googleId,
                    tokenLogin,
                });
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                toast({
                    description: 'Login successful',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            } catch (error) {
                toast({
                    description: error.response.data,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        };
        loginWithGoogle();
    }, []);
    return (
        <Box
            bg={'white'}
            display={'flex'}
            height={'100vh'}
            w={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            {user?.token ? (
                <Navigate to="/chats" replace="true" />
            ) : (
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                />
            )}
        </Box>
    );
}

export default OtherLogin;
