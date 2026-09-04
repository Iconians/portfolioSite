declare module "bun:test" {
  type TestFn = (name: string, fn: () => void | Promise<void>) => void;

  export const test: TestFn & {
    skip: TestFn;
    skipIf: (condition: boolean) => TestFn;
  };
  export function describe(name: string, fn: () => void): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export const expect: {
    (actual: unknown): {
      toBe(expected: unknown): void;
      toEqual(expected: unknown): void;
      toBeTruthy(): void;
      toBeFalsy(): void;
      toBeDefined(): void;
      toBeUndefined(): void;
      toBeNull(): void;
      toBeGreaterThan(expected: number): void;
      toBeLessThan(expected: number): void;
      toContain(expected: unknown): void;
      toMatch(expected: string | RegExp): void;
      toThrow(expected?: string | RegExp | Error): void;
      not: {
        toBe(expected: unknown): void;
        toEqual(expected: unknown): void;
        toBeTruthy(): void;
        toBeFalsy(): void;
        toThrow(expected?: string | RegExp | Error): void;
      };
    };
  };
}
