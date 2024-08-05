export function timezoneReformatter(timeString) {
  // Split the time and timezone parts
  const [time, timezone] = timeString.split("+");

  // Split the time into hours, minutes, and seconds
  const [hours, minutes] = time.split(":").map(Number);

  // Convert the timezone offset to a number
  const timezoneOffset = Number(timezone);

  // Adjust the hours based on the timezone
  const utcHours = hours + timezoneOffset;

  // Format the UTC time as HH:MM
  const formattedTime = `${String(utcHours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;

  return formattedTime;
}
