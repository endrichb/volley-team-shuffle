import { Player } from "@/types/player";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, PlusCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Step1SelectionProps {
  players: Player[];
  onPlayersUpdate: (players: Player[]) => void;
  onNext: () => void;
}

export const Step1Selection = ({ players, onPlayersUpdate, onNext }: Step1SelectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGender, setNewPlayerGender] = useState<"M" | "F">("M");

  const presentCount = players.filter((p) => p.isPresent).length;

  const handleTogglePresent = (playerId: string) => {
    const updatedPlayers = players.map((p) =>
      p.id === playerId
        ? {
            ...p,
            isPresent: !p.isPresent,
            // Set defaults when marking as present
            technical: !p.isPresent && p.technical === 0 ? 5 : p.technical,
            physical: !p.isPresent && p.physical === 0 ? 5 : p.physical,
            serve: !p.isPresent && !p.serve ? "overhand-soft" as const : p.serve,
            spike: !p.isPresent && !p.spike ? "normal" as const : p.spike,
            block: !p.isPresent && !p.block ? "no-jump" as const : p.block,
          }
        : p
    );
    onPlayersUpdate(updatedPlayers);
  };

  const handleSelectAll = () => {
    onPlayersUpdate(
      players.map((p) => ({
        ...p,
        isPresent: true,
        technical: p.technical === 0 ? 5 : p.technical,
        physical: p.physical === 0 ? 5 : p.physical,
        serve: !p.serve ? "overhand-soft" : p.serve,
        spike: !p.spike ? "normal" : p.spike,
        block: !p.block ? "no-jump" : p.block,
      }))
    );
  };

  const handleDeselectAll = () => {
    onPlayersUpdate(players.map((p) => ({ ...p, isPresent: false })));
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: `temp-${Date.now()}`,
      name: newPlayerName.trim(),
      isPresent: true,
      technical: 5,
      physical: 5,
      gender: newPlayerGender,
      serve: "overhand-soft",
      spike: "normal",
      block: "no-jump",
      isTemporary: true,
    };

    onPlayersUpdate([...players, newPlayer]);
    setNewPlayerName("");
    setNewPlayerGender("M");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          1️⃣ Selecione os Jogadores Presentes
        </h2>
        <p className="text-muted-foreground">
          {presentCount} {presentCount === 1 ? "jogador selecionado" : "jogadores selecionados"}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={handleSelectAll} variant="outline" size="sm" className="gap-1.5">
          <CheckSquare className="w-4 h-4" />
          Marcar Todos
        </Button>
        <Button onClick={handleDeselectAll} variant="outline" size="sm" className="gap-1.5">
          <Square className="w-4 h-4" />
          Desmarcar Todos
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Jogador Temporário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Digite o nome"
                  onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero</Label>
                <Select value={newPlayerGender} onValueChange={(v) => setNewPlayerGender(v as "M" | "F")}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddPlayer} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {players.map((player) => (
          <Card
            key={player.id}
            className={`p-4 cursor-pointer transition-all hover:scale-102 ${
              player.isPresent ? "bg-primary/5 border-primary/20" : "bg-muted/30"
            }`}
            onClick={() => handleTogglePresent(player.id)}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={player.isPresent} onCheckedChange={() => handleTogglePresent(player.id)} />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{player.name}</p>
                <p className="text-xs text-muted-foreground">
                  {player.gender === "M" ? "👨 Masculino" : "👩 Feminino"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={onNext}
          size="lg"
          disabled={presentCount === 0}
          className="gap-2 text-lg px-8"
        >
          Próximo: Definir Atributos
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
