import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shuffle, Save } from "lucide-react";
import { useState } from "react";

interface GeneratorControlsProps {
  presentCount: number;
  onGenerate: (numberOfTeams: 2 | 3) => void;
  onSave?: () => void;
  disabled?: boolean;
}

export const GeneratorControls = ({
  presentCount,
  onGenerate,
  onSave,
  disabled,
}: GeneratorControlsProps) => {
  const [numberOfTeams, setNumberOfTeams] = useState<"2" | "3">("2");

  const requiredPlayers = numberOfTeams === "2" ? 14 : 18;
  const canGenerate = presentCount >= requiredPlayers;

  const handleGenerate = () => {
    if (canGenerate) {
      onGenerate(parseInt(numberOfTeams) as 2 | 3);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-background border-border">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Configuração da Partida
          </h3>
          <RadioGroup
            value={numberOfTeams}
            onValueChange={(v) => setNumberOfTeams(v as "2" | "3")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors">
              <RadioGroupItem value="2" id="teams-2" />
              <Label htmlFor="teams-2" className="flex-1 cursor-pointer">
                <span className="font-medium">2 Times</span>
                <span className="text-sm text-muted-foreground ml-2">
                  (7 jogadores cada - 14 total)
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors">
              <RadioGroupItem value="3" id="teams-3" />
              <Label htmlFor="teams-3" className="flex-1 cursor-pointer">
                <span className="font-medium">3 Times</span>
                <span className="text-sm text-muted-foreground ml-2">
                  (6 jogadores cada - 18 total)
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          {!canGenerate && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Você precisa de {requiredPlayers} jogadores presentes.
                Atualmente: {presentCount}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || disabled}
              className="flex-1 gap-2"
              size="lg"
            >
              <Shuffle className="w-4 h-4" />
              Gerar Times
            </Button>
            {onSave && (
              <Button
                onClick={onSave}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
