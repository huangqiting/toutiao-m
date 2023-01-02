export function getItem(key) {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (err) {
    // 只有undefined不能反序列化，会报错，报错返回原值
    return value;
  }
}
export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function removeItem(key) {
  localStorage.removeItem(key);
}
