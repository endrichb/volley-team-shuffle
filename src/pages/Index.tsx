import { useState, useEffect } from "react";
import { Player, Team, BalancePriority } from "@/types/player";
import { initialPlayers } from "@/data/initialPlayers";
import { generateBalancedTeams } from "@/utils/teamGenerator";
import { shareTeamsOnWhatsApp, copyTeamsToClipboard } from "@/utils/whatsappShare";
import { celebrateTeamsGeneration } from "@/utils/confetti";
import { TeamDisplay } from "@/components/TeamDisplay";
import { StepIndicator } from "@/components/StepIndicator";
import { Step1Selection } from "@/components/Step1Selection";
import { Step2Attributes } from "@/components/Step2Attributes";
import { Step3Generate } from "@/components/Step3Generate";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Share2, Home, Copy, Settings } from "lucide-react";
import atenasLogo from "@/assets/atenas-logo.png";

const STORAGE_KEYS = {
  PLAYERS: "volleyball-players",
  PREFERENCES: "volleyball-preferences",
};

type Step = 1 | 2 | 3;

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [numberOfTeams, setNumberOfTeams] = useState<2 | 3>(2);
  const [balancePriority, setBalancePriority] = useState<BalancePriority>("balanced");
  const [generatedTeams, setGeneratedTeams] = useState<Team[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    } else {
      setPlayers(initialPlayers);
    }

    if (savedPreferences) {
      const prefs = JSON.parse(savedPreferences);
      setNumberOfTeams(prefs.numberOfTeams ?? 2);
      setBalancePriority(prefs.balancePriority ?? "balanced");
    }
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify({ numberOfTeams, balancePriority })
    );
  }, [numberOfTeams, balancePriority]);

  const determineNumberOfTeams = (totalPlayers: number): 2 | 3 | null => {
    if (totalPlayers >= 16) return 3;
    if (totalPlayers >= 10) return 2;
    return null;
  };

  const handleGenerateTeams = () => {
    const presentPlayers = players.filter((p) => p.isPresent);
    const totalPlayers = presentPlayers.length;
    const autoNumberOfTeams = determineNumberOfTeams(totalPlayers);

    if (!autoNumberOfTeams) {
      toast({
        title: "Jogadores insuficientes",
        description: "⚠️ Mínimo de 10 jogadores necessários para gerar times",
        variant: "destructive",
      });
      return;
    }

    if (totalPlayers > 21) {
      toast({
        title: "Muitos jogadores",
        description: "⚠️ Máximo de 21 jogadores. Alguns ficarão fora dos times.",
        variant: "destructive",
      });
      return;
    }

    const idealPlayers = autoNumberOfTeams === 2 ? 14 : 18;
    if (totalPlayers < idealPlayers) {
      toast({
        title: "Aviso",
        description: `⚠️ Faltam ${idealPlayers - totalPlayers} jogador(es) para a formação ideal`,
      });
    }

    setIsGenerating(true);
    setNumberOfTeams(autoNumberOfTeams);
    
    toast({
      title: "Calculando melhor distribuição... 🧮",
      description: "Analisando jogadores e habilidades...",
    });
    
    setTimeout(() => {
      try {
        const teams = generateBalancedTeams(presentPlayers, autoNumberOfTeams, balancePriority);
        setGeneratedTeams(teams);

        celebrateTeamsGeneration();

        // Scroll para o resultado
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 300);

        toast({
          title: "🎉 Times gerados com sucesso!",
          description: `${autoNumberOfTeams} times foram criados com balanceamento inteligente.`,
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
    }, 2000);
  };

  const handleRegenerateTeams = () => {
    handleGenerateTeams();
  };

  const handleShareWhatsApp = () => {
    if (generatedTeams) {
      shareTeamsOnWhatsApp(generatedTeams);
      toast({
        title: "Compartilhando no WhatsApp",
        description: "Abrindo WhatsApp para compartilhar os times...",
      });
    }
  };

  const handleCopyResult = async () => {
    if (generatedTeams) {
      const success = await copyTeamsToClipboard(generatedTeams);
      if (success) {
        toast({
          title: "✅ Resultado copiado!",
          description: "Cole no WhatsApp ou onde preferir.",
        });
      } else {
        toast({
          title: "Erro ao copiar",
          description: "Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAdjustPlayers = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangePriority = () => {
    setGeneratedTeams(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToStart = () => {
    setGeneratedTeams(null);
    setCurrentStep(1);
  };

  const renderStep = () => {
    if (generatedTeams) {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-2 print:hidden">
            <Button
              onClick={handleRegenerateTeams}
              variant="default"
              size="sm"
              className="gap-2"
              disabled={isGenerating}
            >
              <RotateCcw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              Gerar Novamente
            </Button>
            <Button
              onClick={handleAdjustPlayers}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Ajustar Jogadores
            </Button>
            <Button
              onClick={handleChangePriority}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              ⚖️ Mudar Prioridade
            </Button>
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              onClick={handleCopyResult}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar
            </Button>
            <Button
              onClick={handleBackToStart}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Início
            </Button>
          </div>
          <TeamDisplay teams={generatedTeams} />
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <Step1Selection
            players={players}
            onPlayersUpdate={setPlayers}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <Step2Attributes
            players={players}
            onPlayersUpdate={setPlayers}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <Step3Generate
            players={players}
            balancePriority={balancePriority}
            onBalancePriorityChange={setBalancePriority}
            onGenerate={handleGenerateTeams}
            onBack={() => setCurrentStep(2)}
            isGenerating={isGenerating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg print:shadow-none print:bg-primary">
        <div className="container mx-auto px-4 py-6 print:py-3">
          <div className="flex items-center gap-3">
            <img src={atenasLogo} alt="Atenas Logo" className="w-12 h-12 print:w-8 print:h-8" />
            <div>
              <h1 className="text-3xl font-bold print:text-2xl">Gerador de Times - Atenas</h1>
              <p className="text-sm opacity-90">Vôlei Atenas Canoas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 print:py-4">
        {!generatedTeams && <StepIndicator currentStep={currentStep} />}
        {renderStep()}
      </main>

      <footer className="mt-16 py-6 border-t border-border bg-muted/30 print:mt-4 print:py-2">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">🏐 Vôlei Atenas Canoas</p>
          <p className="text-xs">📍 Escola Leonel Brizola</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
