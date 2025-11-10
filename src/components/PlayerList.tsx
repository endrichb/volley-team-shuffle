import { Player } from "@/types/player";
import { PlayerCard } from "./PlayerCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
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

interface PlayerListProps {
  players: Player[];
  onPlayersUpdate: (players: Player[]) => void;
}

export const PlayerList = ({ players, onPlayersUpdate }: PlayerListProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGender, setNewPlayerGender] = useState<"M" | "F">("M");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePlayerUpdate = (updatedPlayer: Player) => {
    const updatedPlayers = players.map((p) =>
      p.id === updatedPlayer.id ? updatedPlayer : p
    );
    onPlayersUpdate(updatedPlayers);
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
      isTemporary: true,
    };

    onPlayersUpdate([...players, newPlayer]);
    setNewPlayerName("");
    setNewPlayerGender("M");
    setDialogOpen(false);
  };

  const presentCount = players.filter((p) => p.isPresent).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Jogadores</h2>
          <p className="text-sm text-muted-foreground">
            {presentCount} {presentCount === 1 ? "jogador presente" : "jogadores presentes"}
          </p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onUpdate={handlePlayerUpdate}
          />
        ))}
      </div>
    </div>
  );
};
