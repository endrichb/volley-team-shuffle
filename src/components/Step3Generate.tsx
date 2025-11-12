import { Player } from "@/types/player";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wind, Swords, Shield, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Step3GenerateProps {
  players: Player[];
  numberOfTeams: 2 | 3;
  onNumberOfTeamsChange: (value: 2 | 3) => void;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

export const Step3Generate = ({
  players,
  numberOfTeams,
  onNumberOfTeamsChange,
  onGenerate,
  onBack,
  isGenerating,
}: Step3GenerateProps) => {
  const presentPlayers = players.filter((p) => p.isPresent);
  const totalAverage =
    presentPlayers.reduce((sum, p) => sum + (p.technical + p.physical) / 2, 0) / presentPlayers.length;
  const maleCount = presentPlayers.filter((p) => p.gender === "M").length;
  const femaleCount = presentPlayers.filter((p) => p.gender === "F").length;
  
  const strongServers = presentPlayers.filter(
    (p) => p.serve === "overhand-strong" || p.serve === "underhand-strong"
  ).length;
  const strongSpikers = presentPlayers.filter((p) => p.spike === "strong").length;
  const blockers = presentPlayers.filter((p) => p.block === "jumps").length;

  const requiredPlayers = numberOfTeams === 2 ? 14 : 18;
  const hasEnoughPlayers = presentPlayers.length >= requiredPlayers;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          3️⃣ Resumo e Geração dos Times
        </h2>
        <p className="text-muted-foreground">
          Revise as informações e configure a partida
        </p>
      </div>

      {/* Resumo Geral */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">📊 Resumo Geral</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total de Jogadores</p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold text-foreground">{presentPlayers.length}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Média Geral</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold text-foreground">{totalAverage.toFixed(1)}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Distribuição</p>
            <p className="text-lg font-bold text-foreground">
              {maleCount} 👨 / {femaleCount} 👩
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sacadores Fortes</p>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-primary" />
              <p className="text-xl font-bold text-foreground">{strongServers}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Cortadores Fortes</p>
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-primary" />
              <p className="text-xl font-bold text-foreground">{strongSpikers}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Bloqueadores</p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <p className="text-xl font-bold text-foreground">{blockers}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Jogadores */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">👥 Jogadores Selecionados</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {presentPlayers.map((player) => {
            const avg = ((player.technical + player.physical) / 2).toFixed(1);
            const isStrongServer = player.serve === "overhand-strong" || player.serve === "underhand-strong";
            const isStrongSpiker = player.spike === "strong";
            const isBlocker = player.block === "jumps";

            return (
              <div key={player.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <span className="text-sm">{player.gender === "M" ? "👨" : "👩"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{player.name}</p>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">{avg}</Badge>
                    {isStrongServer && <Wind className="w-3 h-3 text-primary" />}
                    {isStrongSpiker && <Swords className="w-3 h-3 text-primary" />}
                    {isBlocker && <Shield className="w-3 h-3 text-primary" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Configuração */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">⚙️ Configuração da Partida</h3>
        
        <div className="space-y-6">
          {/* Número de Times */}
          <div className="space-y-3">
            <Label>Número de Times</Label>
            <RadioGroup value={String(numberOfTeams)} onValueChange={(v) => onNumberOfTeamsChange(Number(v) as 2 | 3)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="two-teams" />
                <Label htmlFor="two-teams" className="cursor-pointer">
                  2 Times (7 jogadores cada) - Mínimo 14 jogadores
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="three-teams" />
                <Label htmlFor="three-teams" className="cursor-pointer">
                  3 Times (6 jogadores cada) - Mínimo 18 jogadores
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Validação */}
          {!hasEnoughPlayers && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-semibold">
                ⚠️ Selecione pelo menos {requiredPlayers} jogadores para {numberOfTeams} times
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Botões */}
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" size="lg" className="gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>
        <Button
          onClick={onGenerate}
          size="lg"
          disabled={!hasEnoughPlayers || isGenerating}
          className="gap-2 text-lg px-8 bg-primary hover:bg-primary/90"
        >
          {isGenerating ? "Gerando..." : "🎲 Gerar Times"}
        </Button>
      </div>
    </div>
  );
};
