/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { http } from '../utils/http';

function useFormSignIn(validateLogIn) {
    const toast = useToast();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(validateLogIn(values));
        setIsSubmit(true);
    };

    const handleLogIn = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const { data } = await http.post(
                '/api/user/login',
                values,
                config,
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast({
                title: 'Login successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            navigate('/chats');
        } catch (error) {
            toast({
                title: `${error.response.data}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    // errors change is submit
    useEffect(() => {
        if (isSubmit) {
            if (Object.keys(errors).length === 0) {
                handleLogIn();
            } else {
                toast({
                    title: 'Information incorrect',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        }
        setIsSubmit(false);
    }, [errors]);
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };
    return { values, handleChangeValue, errors, handleSubmit };
}

export default useFormSignIn;
