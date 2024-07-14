import { useEffect, useState } from 'react';
import './home.css';
import Login from '../Auth/Login';
import SignUp from '../Auth/Signup';
import { useNavigate } from 'react-router-dom';
function HomePage() {
    const [switchAuth, setSwitchAuth] = useState('sign in');
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            navigate('/chats');
        }
    }, [navigate]);

    const handleSwitchSignUp = () => {
        setSwitchAuth('sign up');
    };
    const handleSwitchSignIn = () => {
        setSwitchAuth('sign in');
    };
    return (
        <section className="home-container">
            <p className="home-title">Chats app</p>
            <div className="home-auth">
                <div className="switch-text">
                    <span
                        className={`span-switch-text ${
                            switchAuth === 'sign in' ? 'active' : ''
                        }`}
                        onClick={handleSwitchSignIn}
                    >
                        Login
                    </span>
                    <span
                        className={`span-switch-text  ${
                            switchAuth === 'sign up' ? 'active' : ''
                        }`}
                        onClick={handleSwitchSignUp}
                    >
                        Sign up
                    </span>
                </div>
                {switchAuth === 'sign in' ? <Login /> : <SignUp />}
            </div>
        </section>
    );
}

export default HomePage;
