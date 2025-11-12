import { Player, ServeLevel, SpikeLevel, BlockLevel } from "@/types/player";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, Zap, Activity, Wind, Swords, Shield } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  onUpdate: (player: Player) => void;
}

export const PlayerCard = ({ player, onUpdate }: PlayerCardProps) => {
  const handlePresenceChange = (checked: boolean) => {
    onUpdate({ ...player, isPresent: checked });
  };

  const handleTechnicalChange = (value: number[]) => {
    onUpdate({ ...player, technical: value[0] });
  };

  const handlePhysicalChange = (value: number[]) => {
    onUpdate({ ...player, physical: value[0] });
  };

  const handleGenderChange = (value: "M" | "F") => {
    onUpdate({ ...player, gender: value });
  };

  const handleServeChange = (value: ServeLevel) => {
    onUpdate({ ...player, serve: value });
  };

  const handleSpikeChange = (value: SpikeLevel) => {
    onUpdate({ ...player, spike: value });
  };

  const handleBlockChange = (value: BlockLevel) => {
    onUpdate({ ...player, block: value });
  };

  const handleObservationsChange = (value: string) => {
    onUpdate({ ...player, observations: value });
  };

  const average = ((player.technical + player.physical) / 2).toFixed(1);

  return (
    <Card
      className={`p-4 transition-all duration-300 ${
        player.isPresent
          ? "shadow-md border-primary/50 bg-card"
          : "opacity-60 bg-muted/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={player.isPresent}
          onCheckedChange={handlePresenceChange}
          className="mt-1"
        />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">{player.name}</span>
            </div>
            <Select value={player.gender} onValueChange={handleGenderChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {player.isPresent && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 text-secondary" />
                    Técnica
                  </Label>
                  <span className="text-xs font-medium text-muted-foreground">
                    {player.technical}
                  </span>
                </div>
                <Slider
                  value={[player.technical]}
                  onValueChange={handleTechnicalChange}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1">
                    <Activity className="w-3 h-3 text-accent" />
                    Física
                  </Label>
                  <span className="text-xs font-medium text-muted-foreground">
                    {player.physical}
                  </span>
                </div>
                <Slider
                  value={[player.physical]}
                  onValueChange={handlePhysicalChange}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="font-bold text-primary">{average}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="space-y-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-xs flex items-center gap-1 cursor-help">
                        <Wind className="w-3 h-3" style={{ color: "hsl(var(--skill-serve))" }} />
                        Saque
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Qualidade do saque do jogador</p>
                    </TooltipContent>
                  </Tooltip>
                  <Select value={player.serve} onValueChange={handleServeChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underhand-soft">🎈 Por baixo fofo</SelectItem>
                      <SelectItem value="underhand-strong">💪 Por baixo forte</SelectItem>
                      <SelectItem value="overhand-soft">🏐 Por cima fofo</SelectItem>
                      <SelectItem value="overhand-strong">🔥 Por cima forte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-xs flex items-center gap-1 cursor-help">
                        <Swords className="w-3 h-3" style={{ color: "hsl(var(--skill-spike))" }} />
                        Cortada
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Potência da cortada do jogador</p>
                    </TooltipContent>
                  </Tooltip>
                  <Select value={player.spike} onValueChange={handleSpikeChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soft">🐱 Corte fofo</SelectItem>
                      <SelectItem value="normal">✋ Corte normal</SelectItem>
                      <SelectItem value="strong">💥 Corte forte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-xs flex items-center gap-1 cursor-help">
                        <Shield className="w-3 h-3" style={{ color: "hsl(var(--skill-block))" }} />
                        Bloqueio
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Qualidade do bloqueio do jogador</p>
                    </TooltipContent>
                  </Tooltip>
                  <Select value={player.block} onValueChange={handleBlockChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-jump">🚫 Não pula</SelectItem>
                      <SelectItem value="jumps">🦘 Pula no bloqueio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs">Observações</Label>
                <Textarea
                  value={player.observations || ""}
                  onChange={(e) => handleObservationsChange(e.target.value)}
                  placeholder="Notas sobre o jogador..."
                  className="min-h-[60px] text-xs resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
