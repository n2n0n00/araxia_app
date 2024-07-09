export function addressShortener(cryptoAddress) {
  const addressArray = cryptoAddress.split("");
  const start = addressArray.slice(0, 5).join("");
  const end = addressArray
    .slice(addressArray.length - 4, cryptoAddress.length)
    .join("");

  return `${start}...${end}`;
}
