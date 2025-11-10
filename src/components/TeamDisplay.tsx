import { Team } from "@/types/player";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp } from "lucide-react";

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Times Gerados</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map((team, index) => (
          <Card
            key={index}
            className={`p-6 ${teamColors[index]} transition-all duration-300 hover:shadow-lg`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">
                  Time {index + 1}
                </h3>
                <Badge variant="outline" className="gap-1.5">
                  <TrendingUp className="w-3 h-3" />
                  {team.averageScore.toFixed(1)}
                </Badge>
              </div>

              <div className="flex gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  {team.maleCount}M
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  {team.femaleCount}F
                </Badge>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                {team.players.map((player) => {
                  const avg = ((player.technical + player.physical) / 2).toFixed(1);
                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {player.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({player.gender})
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-primary">
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
