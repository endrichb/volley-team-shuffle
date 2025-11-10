export interface Player {
  id: string;
  name: string;
  isPresent: boolean;
  technical: number; // 0-10
  physical: number; // 0-10
  gender: "M" | "F";
  serve?: "weak" | "medium" | "strong";
  strongSpike?: boolean;
  isTemporary?: boolean;
}

export interface Team {
  players: Player[];
  averageScore: number;
  maleCount: number;
  femaleCount: number;
}

export interface GeneratedTeams {
  teams: Team[];
  timestamp: Date;
}
