import { useState, useEffect } from "react";
import { Player, Team } from "@/types/player";
import { initialPlayers } from "@/data/initialPlayers";
import { generateBalancedTeams } from "@/utils/teamGenerator";
import { shareTeamsOnWhatsApp } from "@/utils/whatsappShare";
import { celebrateTeamsGeneration } from "@/utils/confetti";
import { TeamDisplay } from "@/components/TeamDisplay";
import { StepIndicator } from "@/components/StepIndicator";
import { Step1Selection } from "@/components/Step1Selection";
import { Step2Attributes } from "@/components/Step2Attributes";
import { Step3Generate } from "@/components/Step3Generate";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Share2, Home } from "lucide-react";
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
      JSON.stringify({ numberOfTeams })
    );
  }, [numberOfTeams]);

  const handleGenerateTeams = () => {
    setIsGenerating(true);
    
    toast({
      title: "Calculando melhor distribuição... 🧮",
      description: "Analisando jogadores e habilidades...",
    });
    
    setTimeout(() => {
      try {
        const presentPlayers = players.filter((p) => p.isPresent);
        const teams = generateBalancedTeams(presentPlayers, numberOfTeams);
        setGeneratedTeams(teams);

        celebrateTeamsGeneration();

        // Scroll para o resultado
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 300);

        toast({
          title: "🎉 Times gerados com sucesso!",
          description: `${numberOfTeams} times foram criados com balanceamento inteligente.`,
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
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isGenerating}
            >
              <RotateCcw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              Gerar Novamente
            </Button>
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar no WhatsApp
            </Button>
            <Button
              onClick={handleBackToStart}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Voltar ao Início
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
            numberOfTeams={numberOfTeams}
            onNumberOfTeamsChange={setNumberOfTeams}
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
