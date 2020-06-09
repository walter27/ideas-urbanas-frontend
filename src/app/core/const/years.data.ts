function getYears() {
    const currentDate = new Date().getFullYear();
    const years = [];
    for ( let i = 1990; i <= currentDate; i++ ) {
        years.push(i);
    }
    return years;
}

module.exports = {
    getYears
};

