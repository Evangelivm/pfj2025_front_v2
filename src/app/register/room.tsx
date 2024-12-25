import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

type Room = {
  name: string;
  occupiedBeds: number;
  totalBeds: number;
};

const rooms: Room[] = [
  { name: "B01", occupiedBeds: 2, totalBeds: 4 },
  { name: "B02", occupiedBeds: 1, totalBeds: 4 },
  { name: "B03", occupiedBeds: 3, totalBeds: 4 },
  { name: "B04", occupiedBeds: 0, totalBeds: 4 },
];

export function RoomSelectionDialog({
  onSelect,
}: {
  onSelect: (room: string) => void;
}) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          Seleccionar Habitación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#006184] text-white">
        <DialogHeader>
          <DialogTitle>Seleccionar Habitación</DialogTitle>
          <DialogDescription className="text-gray-200">
            Elija una habitación basada en la disponibilidad de camas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {rooms.map((room) => (
            <Button
              key={room.name}
              variant="outline"
              className={`justify-between ${
                selectedRoom === room.name
                  ? "bg-[#01B6D1] text-white"
                  : "bg-white/20"
              } hover:bg-[#01B6D1] hover:text-white`}
              onClick={() => setSelectedRoom(room.name)}
            >
              <span>{room.name}</span>
              <span>
                Ocupadas: {room.occupiedBeds} | Libres:{" "}
                {room.totalBeds - room.occupiedBeds}
              </span>
            </Button>
          ))}
        </div>
        <DialogClose asChild>
          <Button
            className="w-full bg-[#FFB81C] text-[#006184] hover:bg-[#FFB81C]/90"
            onClick={() => {
              if (selectedRoom) {
                onSelect(selectedRoom);
              }
            }}
            disabled={!selectedRoom}
          >
            Confirmar Selección
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
