export const getLastSevenMonths = () => {
    const months = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
            name: monthNames[date.getMonth()],
            fullName: date.toLocaleString('default', { month: 'long' }),
            year: date.getFullYear(),
            monthIndex: date.getMonth()
        });
    }
    return months;
};