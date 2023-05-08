export function checkData(data) {
  if (data === null) {
    return "no info";
  }
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return "no info";
    }
    return data.join(", ");
  }
  return data;
}
