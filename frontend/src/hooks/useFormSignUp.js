/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { http } from '../utils/http';
import { useNavigate } from 'react-router-dom';
function useFormSignIn(validateSignUp) {
    const navigate = useNavigate();
    const toast = useToast();
    const [isSubmit, setIsSubmit] = useState(false);
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        pic: '',
    });
    const [errors, setErrors] = useState({});

    const handleFile = (pic, setIsLoading) => {
        setIsLoading(true);
        if (pic === undefined) {
            toast({
                title: 'Please select an image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        if (
            pic.type === 'image/jpeg' ||
            pic.type === 'image/png' ||
            pic.type === 'image/jpg'
        ) {
            const data = new FormData();
            data.append('file', pic);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'dijvnphep');
            fetch(' https://api.cloudinary.com/v1_1/dijvnphep/image/upload', {
                method: 'POST',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setValues({
                        ...values,
                        pic: data.secure_url,
                    });
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        } else {
            toast({
                title: 'Image not match format.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
            setIsLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setErrors(validateSignUp(values));
    };
    const handleRegister = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            if (values.pic === '')
                values.pic =
                    'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg';
            const { data } = await http.post('/api/user', values, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast({
                title: 'Register successful',
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
    useEffect(() => {
        if (isSubmit) {
            if (Object.keys(errors).length === 0) {
                handleRegister();
            } else {
                toast({
                    title: 'Information incorrect.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        }
    }, [errors]);
    const handleChangeValue = (e, setIsLoading = null) => {
        let { name, value } = e.target;
        if (name === 'pic') {
            value = e.target.files[0];
            handleFile(value, setIsLoading);
        }
        setValues({
            ...values,
            [name]: value,
        });
    };
    return { values, handleChangeValue, handleSubmit, errors };
}

export default useFormSignIn;
