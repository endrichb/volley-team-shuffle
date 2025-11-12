import { Player, Team } from "@/types/player";

const calculatePlayerAverage = (player: Player): number => {
  return (player.technical + player.physical) / 2;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateBalancedTeams = (
  presentPlayers: Player[],
  numberOfTeams: 2 | 3,
  intelligentBalance: boolean = true
): Team[] => {
  const playersPerTeam = numberOfTeams === 2 ? 7 : 6;
  const totalPlayers = numberOfTeams * playersPerTeam;

  if (presentPlayers.length < totalPlayers) {
    throw new Error(`Jogadores insuficientes. Necessário: ${totalPlayers}, Disponível: ${presentPlayers.length}`);
  }

  // Limitar aos jogadores necessários
  const selectedPlayers = presentPlayers.slice(0, totalPlayers);

  // Se não for balanceamento inteligente, apenas embaralha
  if (!intelligentBalance) {
    const shuffled = shuffleArray(selectedPlayers);
    const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
    
    shuffled.forEach((player, index) => {
      teams[index % numberOfTeams].push(player);
    });

    return teams.map((players) => createTeamStats(players));
  }

  // Balanceamento inteligente usando snake draft
  const sorted = [...selectedPlayers].sort(
    (a, b) => calculatePlayerAverage(b) - calculatePlayerAverage(a)
  );

  const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
  let currentTeam = 0;
  let direction = 1; // 1 = forward, -1 = backward

  for (const player of sorted) {
    teams[currentTeam].push(player);

    currentTeam += direction;

    if (currentTeam >= numberOfTeams) {
      currentTeam = numberOfTeams - 1;
      direction = -1;
    } else if (currentTeam < 0) {
      currentTeam = 0;
      direction = 1;
    }
  }

  // Embaralhar dentro de cada time
  const shuffledTeams = teams.map((team) => shuffleArray(team));

  return shuffledTeams.map((players) => createTeamStats(players));
};

const createTeamStats = (players: Player[]): Team => {
  const averageScore =
    players.reduce((sum, p) => sum + calculatePlayerAverage(p), 0) / players.length;
  const maleCount = players.filter((p) => p.gender === "M").length;
  const femaleCount = players.filter((p) => p.gender === "F").length;
  const strongServeCount = players.filter(
    (p) => p.serve === "overhand-strong" || p.serve === "underhand-strong"
  ).length;
  const strongSpikeCount = players.filter((p) => p.spike === "strong").length;
  const strongBlockCount = players.filter((p) => p.block === "jumps").length;

  return {
    players,
    averageScore,
    maleCount,
    femaleCount,
    strongServeCount,
    strongSpikeCount,
    strongBlockCount,
  };
};
