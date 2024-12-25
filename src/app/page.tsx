import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function AsistenciaPage() {
  return (
    <div className="min-h-screen bg-[#006184] text-white">
      <header className="p-4 bg-[#01B6D1] shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          Asistencia de Participantes
        </h1>
        <p className="text-center text-sm mt-1">
          Escriba el nombre, seleccione cuando aparezca y hace click en "Buscar"
        </p>
      </header>

      <main className="container mx-auto p-4 space-y-6 max-w-2xl">
        <Card className="bg-white/10 backdrop-blur border-none">
          <CardHeader>
            <CardTitle className="text-white">Buscar Participante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Ingrese nombre del participante"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                defaultValue="Medrano Ahon, Dane"
              />
              <Button className="bg-[#FFB81C] text-[#006184] hover:bg-[#FFB81C]/90 whitespace-nowrap px-6">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur border-none">
          <CardHeader>
            <CardTitle className="text-white">Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-gray-200">Apellidos</div>
                <div className="text-white font-medium">Medrano Ahon</div>

                <div className="text-gray-200">Nombres</div>
                <div className="text-white font-medium">Daniella Fernanda</div>

                <div className="text-gray-200">Compañía</div>
                <div className="text-white font-medium">C18</div>

                <div className="text-gray-200">Habitación</div>
                <div className="text-white font-medium">Sin Habitación</div>

                <div className="text-gray-200">Edad</div>
                <div className="text-white font-medium">26</div>

                <div className="text-gray-200">Estaca</div>
                <div className="text-white font-medium">San Juan</div>

                <div className="text-gray-200">Barrio</div>
                <div className="text-white font-medium">Jardín</div>
              </div>

              <Button className="w-full mt-4 bg-[#01B6D1] hover:bg-[#01B6D1]/90">
                Confirmar Asistencia
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
