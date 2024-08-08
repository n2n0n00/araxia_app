export function tmzDateReformatter(dateTimeString) {
  // Create a new Date object from the input string
  const date = new Date(dateTimeString);

  // Define arrays for month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract day, month, year, hours, and minutes
  const day = String(date.getDate()).padStart(2, "0"); // Adds leading zero if necessary
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format the date and time in the desired format
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
