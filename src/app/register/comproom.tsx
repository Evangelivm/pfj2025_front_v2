"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { CompanySelectionDialog } from "./company";
import { RoomSelectionDialog } from "./room";
import { socket } from "@/socket"; // Asegúrate de que este archivo socket.js sea accesible

interface ComproomProps {
  edad: number; // Recibe la edad como prop
}
// Definimos el tipo Company
type Company = {
  compañia: number;
  hombres: string;
  mujeres: string;
};

function Comproom({ edad }: ComproomProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Company[]>([]);

  useEffect(() => {
    const channel = `summary-age-${edad}`;

    // Emitir suscripción
    socket.emit("subscribeToChannel", channel);

    // Manejar mensajes nuevos
    socket.on(channel, (message: any) => {
      try {
        // Asegurarse de que el mensaje esté parseado como JSON
        const parsedMessage =
          typeof message === "string" ? JSON.parse(message) : message;

        // Verificar si es un array o encapsular en uno
        const newMessages = Array.isArray(parsedMessage)
          ? parsedMessage
          : [parsedMessage];

        // Validar objetos dentro del array
        const validMessages = newMessages.filter(
          (msg) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.compañia === "number" &&
            typeof msg.hombres === "string" &&
            typeof msg.mujeres === "string"
        );

        // Si el mensaje es válido o vacío, manejarlo
        setTimeout(() => {
          if (validMessages.length > 0) {
            setMessages([...validMessages]); // Actualizar con mensajes válidos
          } else {
            setMessages([]); // Borrar el estado si no hay mensajes válidos
            console.log(
              "Estado borrado debido a mensaje vacío o sin formato válido."
            );
          }
        }, 1000);
      } catch (error) {
        console.error("Error al parsear mensaje:", error);
      }
    });

    // Cleanup
    return () => {
      socket.off(channel);
    };
  }, [edad]);

  console.log(messages);
  return (
    <>
      <div className="space-y-2">
        <Label>8. Compañía de acuerdo a la edad</Label>
        <div className="flex items-center space-x-2">
          <CompanySelectionDialog
            onSelect={setSelectedCompany}
            comp={messages}
          />
          {selectedCompany && (
            <span className="text-white text-sm">
              Compañía seleccionada: C{selectedCompany}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>9. Habitación de acuerdo al sexo</Label>
        <div className="flex items-center space-x-2">
          <RoomSelectionDialog onSelect={setSelectedRoom} />
          {selectedRoom && (
            <span className="text-white text-sm">
              Habitación seleccionada: <b>{selectedRoom}</b>
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Comproom;
