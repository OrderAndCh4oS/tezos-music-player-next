import {useEffect, useState} from "react";
import styles from './styles.module.css';
import Button from "../button/button";
import updateDarkMode from '../../utilities/update-dark-mode';

const DarkModeButton = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedDarkMode = window.localStorage.getItem('darkMode');
        if (storedDarkMode === 'true') setDarkMode(true);
    }, [])

    function handleDarkModeToggle() {
        if (!darkMode) {
            updateDarkMode('dark');
            window?.localStorage.setItem('darkMode', "true");
        } else {
            updateDarkMode('light');
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
