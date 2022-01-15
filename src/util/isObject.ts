export default function isObject(value: any) {
  return Object.getPrototypeOf(value) === Object.prototype;
}
