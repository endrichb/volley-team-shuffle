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
    message += `👨 ${team.maleCount} | 👩 ${team.femaleCount}\n`;
    message += `🔥 ${team.strongServeCount} sacador${team.strongServeCount !== 1 ? 'es' : ''} forte${team.strongServeCount !== 1 ? 's' : ''}\n`;
    message += `💥 ${team.strongSpikeCount} cortador${team.strongSpikeCount !== 1 ? 'es' : ''} forte${team.strongSpikeCount !== 1 ? 's' : ''}\n`;
    message += `🦘 ${team.strongBlockCount} bloqueador${team.strongBlockCount !== 1 ? 'es' : ''}\n\n`;
    
    team.players.forEach((player, idx) => {
      message += `${idx + 1}. ${player.name}\n`;
    });
    
    message += `\n`;
  });

  message += `🏫 Escola Leonel Brizola`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, "_blank");
};
