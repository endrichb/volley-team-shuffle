export type SkillLevel = "weak" | "medium" | "strong";

export interface Player {
  id: string;
  name: string;
  isPresent: boolean;
  technical: number; // 0-10
  physical: number; // 0-10
  gender: "M" | "F";
  serve?: SkillLevel;
  spike?: SkillLevel;
  block?: SkillLevel;
  observations?: string;
  isTemporary?: boolean;
}

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
