export function dateExtractor(dateString) {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
