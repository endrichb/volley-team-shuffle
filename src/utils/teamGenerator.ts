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

const isStrongServer = (player: Player): boolean => {
  return player.serve === "overhand-strong" || player.serve === "underhand-strong";
};

const isStrongSpiker = (player: Player): boolean => {
  return player.spike === "strong";
};

const isBlocker = (player: Player): boolean => {
  return player.block === "jumps";
};

export const generateBalancedTeams = (
  presentPlayers: Player[],
  numberOfTeams: 2 | 3
): Team[] => {
  const playersPerTeam = numberOfTeams === 2 ? 7 : 6;
  const totalPlayers = numberOfTeams * playersPerTeam;

  if (presentPlayers.length < totalPlayers) {
    throw new Error(`Jogadores insuficientes. Necessário: ${totalPlayers}, Disponível: ${presentPlayers.length}`);
  }

  // Limitar aos jogadores necessários
  const selectedPlayers = presentPlayers.slice(0, totalPlayers);

  // FASE 1: SNAKE DRAFT
  // Ordenar jogadores por média (maior → menor)
  const sorted = [...selectedPlayers].sort(
    (a, b) => calculatePlayerAverage(b) - calculatePlayerAverage(a)
  );

  console.log('Jogadores ordenados:', sorted.map(j => `${j.name}: ${calculatePlayerAverage(j).toFixed(1)}`));

  const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
  let currentTeam = 0;
  let direction = 1; // 1 = forward, -1 = backward

  // Distribuir em zigue-zague
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

  console.log('Após snake draft:', teams.map((t, i) => {
    const avg = t.reduce((sum, p) => sum + calculatePlayerAverage(p), 0) / t.length;
    return `Time ${i + 1}: média ${avg.toFixed(1)}`;
  }));

  // FASE 2: REBALANCEAMENTO
  const maxAttempts = 50;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const teamStats = teams.map(createTeamStats);
    const averages = teamStats.map(t => t.averageScore);
    const maxAvg = Math.max(...averages);
    const minAvg = Math.min(...averages);
    const difference = maxAvg - minAvg;

    // Se diferença é aceitável, parar
    if (difference <= 0.5) {
      console.log(`Balanceamento atingido na tentativa ${attempt + 1}: diferença ${difference.toFixed(2)}`);
      break;
    }

    // Encontrar time mais forte e mais fraco
    const strongestTeamIdx = averages.indexOf(maxAvg);
    const weakestTeamIdx = averages.indexOf(minAvg);

    // Tentar trocar jogadores de mesmo gênero
    let swapped = false;
    for (let i = 0; i < teams[strongestTeamIdx].length && !swapped; i++) {
      for (let j = 0; j < teams[weakestTeamIdx].length && !swapped; j++) {
        const strongPlayer = teams[strongestTeamIdx][i];
        const weakPlayer = teams[weakestTeamIdx][j];

        // Só trocar se mesmo gênero
        if (strongPlayer.gender !== weakPlayer.gender) continue;

        const strongAvg = calculatePlayerAverage(strongPlayer);
        const weakAvg = calculatePlayerAverage(weakPlayer);

        // Calcular nova diferença se trocar
        const strongTeamNewAvg = (teamStats[strongestTeamIdx].averageScore * teams[strongestTeamIdx].length - strongAvg + weakAvg) / teams[strongestTeamIdx].length;
        const weakTeamNewAvg = (teamStats[weakestTeamIdx].averageScore * teams[weakestTeamIdx].length - weakAvg + strongAvg) / teams[weakestTeamIdx].length;
        const newDifference = Math.abs(strongTeamNewAvg - weakTeamNewAvg);

        // Se melhora, fazer a troca
        if (newDifference < difference) {
          teams[strongestTeamIdx][i] = weakPlayer;
          teams[weakestTeamIdx][j] = strongPlayer;
          swapped = true;
          console.log(`Troca: ${strongPlayer.name} ↔ ${weakPlayer.name} (tentativa ${attempt + 1})`);
        }
      }
    }

    if (!swapped) break; // Não encontrou mais trocas úteis
  }

  console.log('Após rebalanceamento:', teams.map((t, i) => {
    const avg = t.reduce((sum, p) => sum + calculatePlayerAverage(p), 0) / t.length;
    return `Time ${i + 1}: média ${avg.toFixed(1)}`;
  }));

  // FASE 3: VALIDAÇÃO
  const finalTeamStats = teams.map(createTeamStats);
  const finalAverages = finalTeamStats.map(t => t.averageScore);
  const finalDifference = Math.max(...finalAverages) - Math.min(...finalAverages);
  console.log('Diferença de médias entre times:', finalDifference.toFixed(2));

  // Embaralhar dentro de cada time para variedade visual
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
