// src/lib/types.ts
export interface Vulnerability {
    id: number;
    ip: string;
    port: number;
    viable_exploit: boolean;
    archetype: string;
  }
  