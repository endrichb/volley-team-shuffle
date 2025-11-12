import { Team } from "@/types/player";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Wind, Swords, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamDisplayProps {
  teams: Team[];
}

export const TeamDisplay = ({ teams }: TeamDisplayProps) => {
  const teamColors = [
    "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30",
    "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30",
    "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30",
  ];

  return (
    <div className="space-y-4 print:space-y-2">
      <h2 className="text-2xl font-bold text-foreground print:text-xl">Times Gerados</h2>
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
