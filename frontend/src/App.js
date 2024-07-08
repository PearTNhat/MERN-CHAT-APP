import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Page/Home/Home';
import ChatPage from './Page/Chat/ChatPage';
import { ChatPageProvider } from './Context/ChatPageProvider';
import OtherLogin from './Page/Auth/OtherLogin';
import { Box } from '@chakra-ui/react';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/chats"
                    element={
                        <ChatPageProvider>
                            <ChatPage />
                        </ChatPageProvider>
                    }
                />
                <Route
                    path="/other-login/:googleId/:tokenLogin"
                    element={<OtherLogin />}
                />
                <Route path="*" element={<Box>Not found</Box>} />
            </Routes>
        </div>
    );
}

export default App;
