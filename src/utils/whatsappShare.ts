import { Team } from "@/types/player";

export const shareTeamsOnWhatsApp = (teams: Team[]) => {
  const date = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let message = `⚡ *TIMES ATENAS - ${date}*\n🏐 Vôlei Atenas Canoas\n\n`;

  teams.forEach((team, index) => {
    message += `*TIME ${index + 1}* (Média: ${team.averageScore.toFixed(1)})\n`;
    message += `👨 ${team.maleCount} | 👩 ${team.femaleCount}\n\n`;
    
    team.players.forEach((player) => {
      const avg = ((player.technical + player.physical) / 2).toFixed(1);
      message += `${player.name} (${avg})\n`;
    });
    
    message += `\n🔥 ${team.strongServeCount} sacadores fortes\n`;
    message += `💥 ${team.strongSpikeCount} cortadores fortes\n`;
    message += `🦘 ${team.strongBlockCount} bloqueadores\n\n`;
  });

  message += `🏫 Escola Leonel Brizola`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, "_blank");
};
