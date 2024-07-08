import { createContext, useContext, useState } from 'react';

const ChatPageContext = createContext({});
const ChatPageProvider = ({ children }) => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    return (
        <ChatPageContext.Provider
            value={{
                fetchAgain,
                setFetchAgain,
                socketConnected,
                setSocketConnected,
            }}
        >
            {children}
        </ChatPageContext.Provider>
    );
};
const ChatPageState = () => {
    return useContext(ChatPageContext);
};
export { ChatPageProvider, ChatPageState };
