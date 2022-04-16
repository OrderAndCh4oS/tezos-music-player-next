import {createContext, FC, useState} from 'react';
import Toast from '../components/toast/toast';

export const ToastContext = createContext<any>(null);

const ToastProvider: FC = ({children}) => {
    const [message, setMessage] = useState(null);

    const handleCloseToast = () => {
        setMessage(null);
    };

    return (
        <ToastContext.Provider
            value={{
                message,
                setMessage,
                handleCloseToast
            }}
        >
            {children}
            <Toast message={message} handleCloseToast={handleCloseToast}/>
        </ToastContext.Provider>
    );
};

export default ToastProvider;

