const ID_MASK = 0x5a3f;

function encodeId(id) {
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) return "";
  return (num ^ ID_MASK).toString(8);
}

function decodeId(encodedId) {
  if (!encodedId || !/^[0-7]+$/.test(String(encodedId))) return null;
  const parsed = parseInt(String(encodedId), 8);
  if (!Number.isSafeInteger(parsed)) return null;
  const decoded = parsed ^ ID_MASK;
  return Number.isSafeInteger(decoded) && decoded > 0 ? decoded : null;
}
