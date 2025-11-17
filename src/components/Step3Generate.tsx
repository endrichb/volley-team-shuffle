import { Player, BalancePriority } from "@/types/player";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wind, Swords, Shield, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step3GenerateProps {
  players: Player[];
  balancePriority: BalancePriority;
  onBalancePriorityChange: (value: BalancePriority) => void;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

export const Step3Generate = ({
  players,
  balancePriority,
  onBalancePriorityChange,
  onGenerate,
  onBack,
  isGenerating,
}: Step3GenerateProps) => {
  const presentPlayers = players.filter((p) => p.isPresent);
  const totalPlayers = presentPlayers.length;
  
  const determineNumberOfTeams = (): 2 | 3 | null => {
    if (totalPlayers >= 16) return 3;
    if (totalPlayers >= 10) return 2;
    return null;
  };
  
  const numberOfTeams = determineNumberOfTeams();
  const idealPlayers = numberOfTeams === 2 ? 14 : numberOfTeams === 3 ? 18 : 0;
  
  const totalAverage =
    presentPlayers.reduce((sum, p) => sum + (p.technical + p.physical) / 2, 0) / presentPlayers.length;
  const maleCount = presentPlayers.filter((p) => p.gender === "M").length;
  const femaleCount = presentPlayers.filter((p) => p.gender === "F").length;
  
  const strongServers = presentPlayers.filter(
    (p) => p.serve === "overhand-strong" || p.serve === "underhand-strong"
  ).length;
  const strongSpikers = presentPlayers.filter((p) => p.spike === "strong").length;
  const blockers = presentPlayers.filter((p) => p.block === "jumps").length;

  const hasEnoughPlayers = totalPlayers >= 10 && totalPlayers <= 21;

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
          {/* Prioridade de Balanceamento */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">⚖️ Prioridade de Balanceamento</Label>
            <p className="text-sm text-muted-foreground">
              Escolha o critério mais importante para equilibrar os times:
            </p>
            <Select value={balancePriority} onValueChange={(v) => onBalancePriorityChange(v as BalancePriority)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">🎯 Equilibrado (Recomendado)</SelectItem>
                <SelectItem value="gender">👥 Priorizar Gênero (M/F equilibrado)</SelectItem>
                <SelectItem value="skill">⭐ Priorizar Habilidades (saque/corte/bloqueio)</SelectItem>
                <SelectItem value="score">📊 Priorizar Pontuação (técnica + física)</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-1 text-xs text-muted-foreground">
              <p><strong className="text-foreground">Equilibrado:</strong> Considera todos os critérios de forma balanceada</p>
              <p><strong className="text-foreground">Gênero:</strong> Garante mesma quantidade de homens/mulheres por time</p>
              <p><strong className="text-foreground">Habilidades:</strong> Distribui sacadores, cortadores e bloqueadores uniformemente</p>
              <p><strong className="text-foreground">Pontuação:</strong> Foca em médias iguais, pode desbalancear gênero</p>
            </div>
          </div>

          {/* Configuração Automática */}
          <div className="space-y-3">
            <Label>📋 Configuração Automática</Label>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-lg">
                {totalPlayers} jogadores selecionados → 
                <strong className="text-primary ml-2">
                  {numberOfTeams ? `${numberOfTeams} times` : 'Jogadores insuficientes'}
                </strong>
              </p>
              {numberOfTeams && (
                <p className="text-sm text-muted-foreground mt-2">
                  {numberOfTeams === 3 
                    ? '3 times de aproximadamente 6 jogadores cada'
                    : '2 times de aproximadamente 7 jogadores cada'
                  }
                </p>
              )}
              {idealPlayers > 0 && totalPlayers < idealPlayers && (
                <p className="text-sm text-warning mt-2">
                  ⚠️ Faltam {idealPlayers - totalPlayers} jogador(es) para a formação ideal
                </p>
              )}
            </div>
          </div>

          {/* Validação */}
          {!hasEnoughPlayers && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-semibold">
                {totalPlayers < 10 
                  ? '⚠️ Mínimo de 10 jogadores necessários para gerar times'
                  : '⚠️ Máximo de 21 jogadores suportados. Alguns ficarão fora dos times.'
                }
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
