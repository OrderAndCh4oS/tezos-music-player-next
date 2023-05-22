import styles from './styles.module.css';

const DeleteIcon = () =>
    <svg
        className={styles.deleteIcon}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle fill='var(--black)' cx="50" cy="50" r="50"/>
        <path strokeLinecap="round" strokeWidth="20" stroke="var(--white)" d="M30, 50 L70, 50"/>
    </svg>

export default DeleteIcon;
