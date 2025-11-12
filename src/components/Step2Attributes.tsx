import { Player, ServeLevel, SpikeLevel, BlockLevel } from "@/types/player";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wind, Swords, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Step2AttributesProps {
  players: Player[];
  onPlayersUpdate: (players: Player[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const getPhysicalMessage = (value: number) => {
  if (value <= 3) return { text: "É um cone em campo 🚧", color: "bg-destructive" };
  if (value <= 6) return { text: "É esforçado 💪", color: "bg-warning" };
  return { text: "Dedicação total 🔥", color: "bg-success" };
};

const getTechnicalMessage = (value: number) => {
  if (value <= 3) return { text: "Aprendendo ainda 🎓", color: "bg-info" };
  if (value <= 6) return { text: "Manda bem! 👍", color: "bg-warning" };
  return { text: "Craque demais! ⭐", color: "bg-success" };
};

const serveOptions: { value: ServeLevel; label: string; icon: string }[] = [
  { value: "underhand-soft", label: "Saque por baixo fofo", icon: "🎈" },
  { value: "underhand-strong", label: "Saque por baixo forte", icon: "💪" },
  { value: "overhand-soft", label: "Saque por cima fofo", icon: "🏐" },
  { value: "overhand-strong", label: "Saque por cima forte", icon: "🔥" },
];

const spikeOptions: { value: SpikeLevel; label: string; icon: string }[] = [
  { value: "soft", label: "Corte fofo", icon: "🐱" },
  { value: "normal", label: "Corte normal", icon: "✋" },
  { value: "strong", label: "Corte forte", icon: "💥" },
];

const blockOptions: { value: BlockLevel; label: string; icon: string }[] = [
  { value: "no-jump", label: "Não pula", icon: "🚫" },
  { value: "jumps", label: "Pula no bloqueio", icon: "🦘" },
];

export const Step2Attributes = ({ players, onPlayersUpdate, onNext, onBack }: Step2AttributesProps) => {
  const presentPlayers = players.filter((p) => p.isPresent);

  const handlePlayerUpdate = (playerId: string, updates: Partial<Player>) => {
    const updatedPlayers = players.map((p) =>
      p.id === playerId ? { ...p, ...updates } : p
    );
    onPlayersUpdate(updatedPlayers);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          2️⃣ Configure os Atributos dos Jogadores
        </h2>
        <p className="text-muted-foreground">
          Ajuste as habilidades de cada jogador selecionado
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {presentPlayers.map((player) => {
          const physicalMsg = getPhysicalMessage(player.physical);
          const technicalMsg = getTechnicalMessage(player.technical);

          return (
            <Card key={player.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{player.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {player.gender === "M" ? "👨 Masculino" : "👩 Feminino"}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm">
                  Média: {((player.technical + player.physical) / 2).toFixed(1)}
                </Badge>
              </div>

              {/* Técnica */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Técnica: {player.technical}</Label>
                  <Badge className={technicalMsg.color}>{technicalMsg.text}</Badge>
                </div>
                <Slider
                  value={[player.technical]}
                  onValueChange={(value) => handlePlayerUpdate(player.id, { technical: value[0] })}
                  min={0}
                  max={10}
                  step={1}
                />
              </div>

              {/* Física */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Física: {player.physical}</Label>
                  <Badge className={physicalMsg.color}>{physicalMsg.text}</Badge>
                </div>
                <Slider
                  value={[player.physical]}
                  onValueChange={(value) => handlePlayerUpdate(player.id, { physical: value[0] })}
                  min={0}
                  max={10}
                  step={1}
                />
              </div>

              {/* Saque */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Saque
                </Label>
                <Select
                  value={player.serve}
                  onValueChange={(value) => handlePlayerUpdate(player.id, { serve: value as ServeLevel })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serveOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cortada */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Swords className="w-4 h-4" />
                  Cortada
                </Label>
                <Select
                  value={player.spike}
                  onValueChange={(value) => handlePlayerUpdate(player.id, { spike: value as SpikeLevel })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {spikeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bloqueio */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Bloqueio
                </Label>
                <Select
                  value={player.block}
                  onValueChange={(value) => handlePlayerUpdate(player.id, { block: value as BlockLevel })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blockOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label>Observações (opcional)</Label>
                <Textarea
                  value={player.observations || ""}
                  onChange={(e) => handlePlayerUpdate(player.id, { observations: e.target.value })}
                  placeholder="Notas adicionais..."
                  rows={2}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>
        <Button onClick={onNext} size="lg" className="gap-2">
          Próximo: Revisar e Gerar
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
