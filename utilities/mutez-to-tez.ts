const mutezToTez = (value: number) => (value / 1e6).toLocaleString('local', {minimumFractionDigits: 2});

export default mutezToTez;
