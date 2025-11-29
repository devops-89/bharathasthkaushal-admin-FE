const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

console.log(formatDateForDisplay("2025-11-27T10:00:00.000Z"));
console.log(formatDateForDisplay("2025-11-27"));
console.log(formatDateForDisplay("Invalid Date"));
console.log(formatDateForDisplay(null));
console.log(formatDateForDisplay(undefined));
