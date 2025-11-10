import { useState, useEffect } from "react";
import { Player, Team, GeneratedTeams } from "@/types/player";
import { initialPlayers } from "@/data/initialPlayers";
import { generateBalancedTeams } from "@/utils/teamGenerator";
import { PlayerList } from "@/components/PlayerList";
import { GeneratorControls } from "@/components/GeneratorControls";
import { TeamDisplay } from "@/components/TeamDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Volleyball, RotateCcw, Users, TrendingUp } from "lucide-react";
import atenasLogo from "@/assets/atenas-logo.png";

const STORAGE_KEYS = {
  PLAYERS: "volleyball-players",
  HISTORY: "volleyball-history",
};

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [generatedTeams, setGeneratedTeams] = useState<Team[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Carregar dados do localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    } else {
      setPlayers(initialPlayers);
    }
  }, []);

  // Salvar jogadores no localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    }
  }, [players]);

  const handleGenerateTeams = async (numberOfTeams: 2 | 3) => {
    setIsGenerating(true);
    // Simulate processing for smooth animation
    setTimeout(() => {
      try {
        const presentPlayers = players.filter((p) => p.isPresent);
        const teams = generateBalancedTeams(presentPlayers, numberOfTeams);
        setGeneratedTeams(teams);

        toast({
          title: "Times gerados com sucesso!",
          description: `${numberOfTeams} times foram criados e balanceados.`,
        });
      } catch (error) {
        toast({
          title: "Erro ao gerar times",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  };

  const handleRegenerateTeams = () => {
    if (generatedTeams) {
      const numberOfTeams = generatedTeams.length as 2 | 3;
      handleGenerateTeams(numberOfTeams);
    }
  };

  const handleSaveConfiguration = () => {
    if (!generatedTeams) return;

    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history: GeneratedTeams[] = savedHistory ? JSON.parse(savedHistory) : [];

    const newEntry: GeneratedTeams = {
      teams: generatedTeams,
      timestamp: new Date(),
    };

    const updatedHistory = [newEntry, ...history].slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));

    toast({
      title: "Configuração salva!",
      description: "Os times foram salvos no histórico.",
    });
  };

  const presentCount = players.filter((p) => p.isPresent).length;
  const presentPlayers = players.filter((p) => p.isPresent);
  const totalAverage = presentPlayers.length > 0
    ? presentPlayers.reduce((sum, p) => sum + (p.technical + p.physical) / 2, 0) / presentPlayers.length
    : 0;
  const maleCount = presentPlayers.filter((p) => p.gender === "M").length;
  const femaleCount = presentPlayers.filter((p) => p.gender === "F").length;

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg print:shadow-none print:bg-primary">
        <div className="container mx-auto px-4 py-6 print:py-3">
          <div className="flex items-center gap-3">
            <img src={atenasLogo} alt="Atenas Logo" className="w-12 h-12 print:w-8 print:h-8" />
            <div>
              <h1 className="text-3xl font-bold print:text-2xl">Gerador de Times - Atenas</h1>
              <p className="text-sm opacity-90">
                Vôlei Atenas Canoas
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 print:py-4">
        <div className="space-y-8 print:space-y-4">
          {/* Player List */}
          <div className="print:hidden">
            <PlayerList players={players} onPlayersUpdate={setPlayers} />
          </div>

          {/* Summary Card */}
          {presentCount > 0 && (
            <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-primary/20 print:hidden">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resumo Geral</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Selecionados</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{presentCount}</p>
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
                  <p className="text-sm text-muted-foreground">Homens</p>
                  <p className="text-2xl font-bold text-secondary">{maleCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mulheres</p>
                  <p className="text-2xl font-bold text-secondary">{femaleCount}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Controls */}
          <div className="print:hidden">
            <GeneratorControls
              presentCount={presentCount}
              onGenerate={handleGenerateTeams}
              onSave={generatedTeams ? handleSaveConfiguration : undefined}
              isLoading={isGenerating}
            />
          </div>

          {/* Generated Teams */}
          {generatedTeams && (
            <div className="space-y-4">
              <div className="flex items-center justify-between print:hidden">
                <div className="flex-1" />
                <Button
                  onClick={handleRegenerateTeams}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isGenerating}
                >
                  <RotateCcw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                  Gerar Novamente
                </Button>
              </div>
              <TeamDisplay teams={generatedTeams} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-border bg-muted/30 print:mt-4 print:py-2">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Vôlei Atenas Canoas</p>
          <p className="text-xs">Escola Leonel Brizola</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
