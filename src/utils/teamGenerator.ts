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
  numberOfTeams: 2 | 3
): Team[] => {
  if (presentPlayers.length < numberOfTeams * 6) {
    throw new Error("Jogadores insuficientes");
  }

  const playersPerTeam = numberOfTeams === 2 ? 7 : 6;
  const totalPlayers = numberOfTeams * playersPerTeam;

  // Limitar aos jogadores necessários
  const selectedPlayers = presentPlayers.slice(0, totalPlayers);

  // Separar por gênero
  const males = selectedPlayers.filter((p) => p.gender === "M");
  const females = selectedPlayers.filter((p) => p.gender === "F");

  // Ordenar por média (decrescente)
  males.sort((a, b) => calculatePlayerAverage(b) - calculatePlayerAverage(a));
  females.sort((a, b) => calculatePlayerAverage(b) - calculatePlayerAverage(a));

  // Inicializar times
  const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);

  // Distribuir jogadores de forma alternada (snake draft)
  const allPlayers = [...males, ...females];
  allPlayers.sort((a, b) => calculatePlayerAverage(b) - calculatePlayerAverage(a));

  let currentTeam = 0;
  let direction = 1; // 1 para frente, -1 para trás

  for (const player of allPlayers) {
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

  // Embaralhar dentro de cada time para não ficar previsível
  const shuffledTeams = teams.map((team) => shuffleArray(team));

  // Criar objetos Team com estatísticas
  return shuffledTeams.map((players) => {
    const averageScore =
      players.reduce((sum, p) => sum + calculatePlayerAverage(p), 0) / players.length;
    const maleCount = players.filter((p) => p.gender === "M").length;
    const femaleCount = players.filter((p) => p.gender === "F").length;
    const strongServeCount = players.filter((p) => p.serve === "strong").length;
    const strongSpikeCount = players.filter((p) => p.spike === "strong").length;
    const strongBlockCount = players.filter((p) => p.block === "strong").length;

    return {
      players,
      averageScore,
      maleCount,
      femaleCount,
      strongServeCount,
      strongSpikeCount,
      strongBlockCount,
    };
  });
};
