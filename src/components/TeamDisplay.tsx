import { Team } from "@/types/player";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Wind, Swords, Shield, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamDisplayProps {
  teams: Team[];
}

const calculateBalanceQuality = (teams: Team[]): { difference: number; quality: number; stars: number; message: string } => {
  const averages = teams.map(t => t.averageScore);
  const maxAvg = Math.max(...averages);
  const minAvg = Math.min(...averages);
  const difference = maxAvg - minAvg;

  // Verificar distribuição de habilidades
  const serveVariance = Math.max(...teams.map(t => t.strongServeCount)) - Math.min(...teams.map(t => t.strongServeCount));
  const spikeVariance = Math.max(...teams.map(t => t.strongSpikeCount)) - Math.min(...teams.map(t => t.strongSpikeCount));
  const blockVariance = Math.max(...teams.map(t => t.strongBlockCount)) - Math.min(...teams.map(t => t.strongBlockCount));
  const skillsBalanced = serveVariance <= 1 && spikeVariance <= 1 && blockVariance <= 1;

  let stars = 0;
  let message = "";
  let quality = 0;

  if (difference < 0.5 && skillsBalanced) {
    stars = 5;
    message = "Excelente";
    quality = 100;
  } else if (difference < 0.8) {
    stars = 4;
    message = "Muito Bom";
    quality = 80;
  } else if (difference < 1.2) {
    stars = 3;
    message = "Bom";
    quality = 60;
  } else if (difference < 1.8) {
    stars = 2;
    message = "Regular";
    quality = 40;
  } else {
    stars = 1;
    message = "Considere ajustar atributos";
    quality = 20;
  }

  return { difference, quality, stars, message };
};

export const TeamDisplay = ({ teams }: TeamDisplayProps) => {
  const teamColors = [
    "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30",
    "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30",
    "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30",
  ];

  const balanceAnalysis = calculateBalanceQuality(teams);

  return (
    <div className="space-y-6 print:space-y-2">
      <h2 className="text-2xl font-bold text-foreground print:text-xl">Times Gerados</h2>
      
      {/* Análise de Qualidade */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 print:hidden">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">📊 Análise de Balanceamento</h3>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < balanceAnalysis.stars ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Diferença de Médias</p>
              <p className="text-2xl font-bold text-foreground">
                {balanceAnalysis.difference.toFixed(2)}
                <span className={`text-sm ml-2 ${balanceAnalysis.difference < 0.5 ? 'text-success' : balanceAnalysis.difference < 1.2 ? 'text-warning' : 'text-destructive'}`}>
                  {balanceAnalysis.difference < 0.5 ? '✅ Ótimo!' : balanceAnalysis.difference < 1.2 ? '⚠️ Bom' : '❌ Regular'}
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Distribuição M/F</p>
              <p className="text-lg font-bold text-foreground">
                {Math.abs(Math.max(...teams.map(t => t.maleCount)) - Math.min(...teams.map(t => t.maleCount))) <= 1 ? '✅ Equilibrada' : '⚠️ Desigual'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Habilidades Especiais</p>
              <p className="text-lg font-bold text-foreground">
                {Math.max(...teams.map(t => t.strongServeCount)) - Math.min(...teams.map(t => t.strongServeCount)) <= 1 &&
                 Math.max(...teams.map(t => t.strongSpikeCount)) - Math.min(...teams.map(t => t.strongSpikeCount)) <= 1
                  ? '✅ Bem distribuídas'
                  : '⚠️ Variável'}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-center text-lg font-semibold text-primary">
              Qualidade: {balanceAnalysis.message}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 print:gap-2">
        {teams.map((team, index) => (
          <Card
            key={index}
            className={`p-6 ${teamColors[index]} transition-all duration-300 hover:shadow-lg animate-fade-in print:p-4 print:break-inside-avoid`}
          >
            <div className="space-y-4 print:space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground print:text-lg">
                  Time {index + 1}
                </h3>
                <Badge variant="outline" className="gap-1.5">
                  <TrendingUp className="w-3 h-3" />
                  {team.averageScore.toFixed(1)}
                </Badge>
              </div>

              <div className="flex gap-2 text-sm text-muted-foreground flex-wrap">
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  {team.maleCount}M / {team.femaleCount}F
                </Badge>
                {team.strongServeCount > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="gap-1">
                        <Wind className="w-3 h-3" style={{ color: "hsl(var(--skill-serve))" }} />
                        {team.strongServeCount}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Saques fortes</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {team.strongSpikeCount > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="gap-1">
                        <Swords className="w-3 h-3" style={{ color: "hsl(var(--skill-spike))" }} />
                        {team.strongSpikeCount}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cortadas fortes</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {team.strongBlockCount > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="w-3 h-3" style={{ color: "hsl(var(--skill-block))" }} />
                        {team.strongBlockCount}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bloqueios fortes</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                {team.players.map((player) => {
                  const avg = ((player.technical + player.physical) / 2).toFixed(1);
                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 print:py-1 print:px-2"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate print:text-xs">
                          {player.name}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          ({player.gender})
                        </span>
                        <div className="flex gap-1 ml-auto shrink-0">
                          {(player.serve === "overhand-strong" || player.serve === "underhand-strong") && (
                            <Wind className="w-3 h-3" style={{ color: "hsl(var(--skill-serve))" }} />
                          )}
                          {player.spike === "strong" && (
                            <Swords className="w-3 h-3" style={{ color: "hsl(var(--skill-spike))" }} />
                          )}
                          {player.block === "jumps" && (
                            <Shield className="w-3 h-3" style={{ color: "hsl(var(--skill-block))" }} />
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-primary ml-2 shrink-0 print:text-xs">
                        {avg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
