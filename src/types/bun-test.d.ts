declare module "bun:test" {
  export function test(name: string, fn: () => void | Promise<void>): void;
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
      toThrow(expected?: string | RegExp | Error): void;
      not: {
        toBe(expected: unknown): void;
        toEqual(expected: unknown): void;
        toBeTruthy(): void;
        toBeFalsy(): void;
      };
    };
  };
}
