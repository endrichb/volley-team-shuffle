import { Team } from "@/types/player";

const generateTeamsText = (teams: Team[]): string => {
  const date = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let message = `⚡ *TIMES ATENAS - ${date}*\n🏐 Vôlei Atenas Canoas\n\n`;

  teams.forEach((team, index) => {
    message += `*TIME ${index + 1}* (Média: ${team.averageScore.toFixed(1)})\n`;
    message += `👨 ${team.maleCount} | 👩 ${team.femaleCount}\n`;
    
    if (team.strongServeCount > 0) {
      message += `🔥 ${team.strongServeCount} sacador${team.strongServeCount !== 1 ? "es" : ""} forte${team.strongServeCount !== 1 ? "s" : ""}\n`;
    }
    if (team.strongSpikeCount > 0) {
      message += `💥 ${team.strongSpikeCount} cortador${team.strongSpikeCount !== 1 ? "es" : ""} forte${team.strongSpikeCount !== 1 ? "s" : ""}\n`;
    }
    if (team.strongBlockCount > 0) {
      message += `🦘 ${team.strongBlockCount} bloqueador${team.strongBlockCount !== 1 ? "es" : ""}\n`;
    }

    message += `\n`;

    team.players.forEach((player, idx) => {
      message += `${idx + 1}. ${player.name}\n`;
    });

    message += `\n`;
  });

  message += `🏫 Escola Leonel Brizola`;

  return message;
};

export const shareTeamsOnWhatsApp = (teams: Team[]) => {
  const message = generateTeamsText(teams);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};

export const copyTeamsToClipboard = async (teams: Team[]): Promise<boolean> => {
  const message = generateTeamsText(teams);

  try {
    await navigator.clipboard.writeText(message);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement("textarea");
      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackError) {
      console.error("Failed to copy:", fallbackError);
      return false;
    }
  }
};
