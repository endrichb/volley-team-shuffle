import { useState, useEffect } from "react";
import { Player, Team, GeneratedTeams } from "@/types/player";
import { initialPlayers } from "@/data/initialPlayers";
import { generateBalancedTeams } from "@/utils/teamGenerator";
import { PlayerList } from "@/components/PlayerList";
import { GeneratorControls } from "@/components/GeneratorControls";
import { TeamDisplay } from "@/components/TeamDisplay";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Volleyball, RotateCcw } from "lucide-react";

const STORAGE_KEYS = {
  PLAYERS: "volleyball-players",
  HISTORY: "volleyball-history",
};

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [generatedTeams, setGeneratedTeams] = useState<Team[] | null>(null);
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

  const handleGenerateTeams = (numberOfTeams: 2 | 3) => {
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
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Volleyball className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Gerador de Times - Vôlei</h1>
              <p className="text-sm opacity-90">
                Balanceamento automático e inteligente
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Player List */}
          <PlayerList players={players} onPlayersUpdate={setPlayers} />

          {/* Controls */}
          <GeneratorControls
            presentCount={presentCount}
            onGenerate={handleGenerateTeams}
            onSave={generatedTeams ? handleSaveConfiguration : undefined}
          />

          {/* Generated Teams */}
          {generatedTeams && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1" />
                <Button
                  onClick={handleRegenerateTeams}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Gerar Novamente
                </Button>
              </div>
              <TeamDisplay teams={generatedTeams} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Sistema de Geração de Times para Vôlei Recreativo</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
