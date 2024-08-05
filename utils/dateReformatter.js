export function dateReformatter(dateString) {
  const [year, month, day] = dateString.split("-");

  const date = new Date(year, month - 1, day);
  const shortMonth = date.toLocaleString("en-US", { month: "short" });

  return `${day}/${shortMonth}/${year}`;
}
