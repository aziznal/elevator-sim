export function exhaustiveGuard(value: never): never {
  throw new Error(`Exhaustive guard received value: ${value}`);
}
