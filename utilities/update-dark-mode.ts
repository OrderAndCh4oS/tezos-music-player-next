const updateDarkMode = (value: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-theme', value)
}

export default updateDarkMode;
