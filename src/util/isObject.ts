export default function isObject(value: any): boolean {
  return !!value && Object.getPrototypeOf(value) === Object.prototype;
}
