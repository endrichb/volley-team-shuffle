import { Player, Team, BalancePriority } from "@/types/player";

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

interface BalanceWeights {
  gender: number;
  skills: number;
  score: number;
}

const getWeightsForPriority = (priority: BalancePriority): BalanceWeights => {
  switch (priority) {
    case "balanced":
      return { gender: 10, skills: 8, score: 7 };
    case "gender":
      return { gender: 10, skills: 5, score: 3 };
    case "skill":
      return { gender: 5, skills: 10, score: 4 };
    case "score":
      return { gender: 3, skills: 4, score: 10 };
  }
};

const calculateImbalanceScore = (teams: Player[][], weights: BalanceWeights): number => {
  let score = 0;
  const teamStats = teams.map(createTeamStats);

  // 1. Gender imbalance
  const avgMales = teamStats.reduce((sum, t) => sum + t.maleCount, 0) / teams.length;
  const avgFemales = teamStats.reduce((sum, t) => sum + t.femaleCount, 0) / teams.length;
  
  teamStats.forEach((team) => {
    score += Math.abs(team.maleCount - avgMales) * weights.gender;
    score += Math.abs(team.femaleCount - avgFemales) * weights.gender;
  });

  // 2. Skills imbalance
  const avgServers = teamStats.reduce((sum, t) => sum + t.strongServeCount, 0) / teams.length;
  const avgSpikers = teamStats.reduce((sum, t) => sum + t.strongSpikeCount, 0) / teams.length;
  const avgBlockers = teamStats.reduce((sum, t) => sum + t.strongBlockCount, 0) / teams.length;

  teamStats.forEach((team) => {
    score += Math.abs(team.strongServeCount - avgServers) * weights.skills;
    score += Math.abs(team.strongSpikeCount - avgSpikers) * weights.skills;
    score += Math.abs(team.strongBlockCount - avgBlockers) * weights.skills;
  });

  // 3. Score imbalance
  const avgScores = teamStats.map((t) => t.averageScore);
  const overallAvg = avgScores.reduce((a, b) => a + b, 0) / avgScores.length;

  avgScores.forEach((avg) => {
    score += Math.abs(avg - overallAvg) * weights.score;
  });

  return score;
};

const findBestSwap = (
  teams: Player[][],
  weights: BalanceWeights
): { team1: number; player1: number; team2: number; player2: number; improvement: number } | null => {
  const currentScore = calculateImbalanceScore(teams, weights);
  let bestSwap = null;
  let bestImprovement = 0;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      for (let p1 = 0; p1 < teams[i].length; p1++) {
        for (let p2 = 0; p2 < teams[j].length; p2++) {
          // Only swap same gender to maintain balance
          if (teams[i][p1].gender !== teams[j][p2].gender) continue;

          // Simulate swap
          const simulatedTeams = teams.map((team, idx) => {
            if (idx === i) {
              const newTeam = [...team];
              newTeam[p1] = teams[j][p2];
              return newTeam;
            } else if (idx === j) {
              const newTeam = [...team];
              newTeam[p2] = teams[i][p1];
              return newTeam;
            }
            return team;
          });

          const newScore = calculateImbalanceScore(simulatedTeams, weights);
          const improvement = currentScore - newScore;

          if (improvement > bestImprovement) {
            bestImprovement = improvement;
            bestSwap = { team1: i, player1: p1, team2: j, player2: p2, improvement };
          }
        }
      }
    }
  }

  return bestSwap;
};

export const generateBalancedTeams = (
  presentPlayers: Player[],
  numberOfTeams: 2 | 3,
  priority: BalancePriority = "balanced"
): Team[] => {
  console.log("=== BALANCEAMENTO INICIADO ===");
  console.log("Prioridade:", priority);
  
  const weights = getWeightsForPriority(priority);
  console.log("Pesos:", weights);
  console.log("Jogadores:", presentPlayers.map((j) => `${j.name} (${j.gender})`));
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

  console.log("Jogadores ordenados:", sorted.map((j) => `${j.name}: ${calculatePlayerAverage(j).toFixed(1)}`));

  const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
  let currentTeam = 0;
  let direction = 1;

  // FASE 1: SNAKE DRAFT
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

  console.log("Após snake draft:", teams.map((t, i) => {
    const avg = t.reduce((sum, p) => sum + calculatePlayerAverage(p), 0) / t.length;
    return `Time ${i + 1}: média ${avg.toFixed(1)}`;
  }));

  const initialScore = calculateImbalanceScore(teams, weights);
  console.log("Score de desbalanceamento inicial:", initialScore.toFixed(2));

  // FASE 2: REBALANCEAMENTO MULTICRITERIO
  const maxIterations = 100;
  let improvements = 0;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const bestSwap = findBestSwap(teams, weights);

    if (!bestSwap || bestSwap.improvement <= 0.01) {
      console.log(`Balanceamento concluído na iteração ${iteration + 1}`);
      break;
    }

    // Execute swap
    const temp = teams[bestSwap.team1][bestSwap.player1];
    teams[bestSwap.team1][bestSwap.player1] = teams[bestSwap.team2][bestSwap.player2];
    teams[bestSwap.team2][bestSwap.player2] = temp;
    
    improvements++;
    console.log(
      `Troca ${improvements}: ${temp.name} ↔ ${teams[bestSwap.team1][bestSwap.player1].name} (melhoria: ${bestSwap.improvement.toFixed(2)})`
    );
  }

  console.log(`Balanceamento concluído com ${improvements} trocas`);
  console.log("Após rebalanceamento:", teams.map((t, i) => {
    const avg = t.reduce((sum, p) => sum + calculatePlayerAverage(p), 0) / t.length;
    return `Time ${i + 1}: média ${avg.toFixed(1)}`;
  }));

  // FASE 3: VALIDAÇÃO
  const finalTeamStats = teams.map(createTeamStats);
  const finalAverages = finalTeamStats.map((t) => t.averageScore);
  const finalDifference = Math.max(...finalAverages) - Math.min(...finalAverages);
  const finalScore = calculateImbalanceScore(teams, weights);
  
  console.log("=== VALIDAÇÃO FINAL ===");
  console.log("Diferença de médias entre times:", finalDifference.toFixed(2));
  console.log("Score de desbalanceamento final:", finalScore.toFixed(2));
  console.log("Times gerados:", teams.map((t, i) => ({
    time: i + 1,
    jogadores: t.map((p) => p.name),
    media: (t.reduce((sum, p) => sum + calculatePlayerAverage(p), 0) / t.length).toFixed(1),
  })));
  console.log("=== BALANCEAMENTO CONCLUÍDO ===");

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
