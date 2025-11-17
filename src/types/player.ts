export type ServeLevel = "underhand-soft" | "underhand-strong" | "overhand-soft" | "overhand-strong";
export type SpikeLevel = "soft" | "normal" | "strong";
export type BlockLevel = "no-jump" | "jumps";

export interface Player {
  id: string;
  name: string;
  isPresent: boolean;
  technical: number; // 0-10
  physical: number; // 0-10
  gender: "M" | "F";
  serve: ServeLevel;
  spike: SpikeLevel;
  block: BlockLevel;
  observations?: string;
  isTemporary?: boolean;
}

export type BalancePriority = "balanced" | "gender" | "skill" | "score";

export interface Team {
  players: Player[];
  averageScore: number;
  maleCount: number;
  femaleCount: number;
  strongServeCount: number;
  strongSpikeCount: number;
  strongBlockCount: number;
}

export interface GeneratedTeams {
  teams: Team[];
  timestamp: Date;
}
