import {useEffect, useState} from "react";
import styles from './styles.module.css';
import Button from "../button/button";

const DarkModeButton = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedDarkMode = window.localStorage.getItem('darkMode');
        if(storedDarkMode === 'true') setDarkMode(true);
    }, [])

    function handleDarkModeToggle() {
        if(!darkMode) {
            document.body.classList.add('darkMode');
            window?.localStorage.setItem('darkMode', "true");
        } else {
            document.body.classList.remove('darkMode');
            window?.localStorage.setItem('darkMode', 'false');
        }
        setDarkMode(!darkMode);
    }

    return (
        <div className={styles.darkModeButtonHolder}>
            <Button
                onClick={handleDarkModeToggle}
                id={'darkModeButton'}
                title={'Toggle dark mode'}
            >{darkMode ? '✧' : '✦'}</Button>
        </div>
    );
};

export default DarkModeButton;
