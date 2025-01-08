declare module 'bcryptjs' {
    export function hash(data: string, saltRounds: number): string;
    export function compare(data: string, encrypted: string): boolean;
    export function genSalt(rounds?: number): string;
  }
  