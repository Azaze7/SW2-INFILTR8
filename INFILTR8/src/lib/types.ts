
export interface Vulnerability {
  id: string;
  ip: string;
  port: string;
  viable_exploit: string;
  archetype: string;
}

export interface PortZeroEntryRow {
  id: string;
  ip: string;
  port: string;
}
export interface RankedEntryPointRow {
  ip: string;
  port: string;
  combined_score: number;
}
export type row = Vulnerability
export type Row = RankedEntryPointRow; 
