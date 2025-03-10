"use client";

import { useState, useEffect } from "react";
import { Building2, Users, UserRound, MapPin, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStats } from "@/connections";

interface Participant {
  id: number;
  name: string;
  gender: string;
  present: boolean;
  stake: string;
  ward: string;
  location: string;
}

interface Company {
  id: number;
  name: string;
  participants: Participant[];
}

interface ParticipanteStats {
  nombres: string;
  sexo: "H" | "M";
  estaca: string;
  barrio: string;
  compañia: number;
  habitacion: string;
  asistio: "Si" | "No";
}

const transformStatsToCompanies = (
  statsData: ParticipanteStats[]
): Company[] => {
  // Agrupar participantes por compañía
  const groupedByCompany = statsData.reduce((acc, participant) => {
    const companyId = participant.compañia;
    if (!acc[companyId]) {
      acc[companyId] = [];
    }
    acc[companyId].push(participant);
    return acc;
  }, {} as Record<number, ParticipanteStats[]>);

  // Transformar grupos en el formato deseado
  const companies = Object.entries(groupedByCompany).map(
    ([companyId, participants]) => {
      return {
        id: parseInt(companyId),
        name: `Compañía ${companyId}`,
        participants: participants.map((p, index) => ({
          id: index + 1,
          name: p.nombres,
          gender: p.sexo,
          present: p.asistio === "Si",
          stake: p.estaca,
          ward: p.barrio,
          location: p.habitacion,
        })),
      };
    }
  );

  return companies.sort((a, b) => a.id - b.id);
};

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const statsData = await getStats();
        const transformedData = transformStatsToCompanies(statsData);
        setCompanies(transformedData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Calculate totals
  const totalCompanies = companies.length;
  const totalParticipants = companies.reduce(
    (acc, company) => acc + company.participants.length,
    0
  );
  const maleParticipants = companies.reduce(
    (acc, company) =>
      acc + company.participants.filter((p) => p.gender === "H").length,
    0
  );
  const femaleParticipants = companies.reduce(
    (acc, company) =>
      acc + company.participants.filter((p) => p.gender === "M").length,
    0
  );

  const stats = [
    { title: "Total Compañías", value: totalCompanies, icon: Building2 },
    { title: "Total Participantes", value: totalParticipants, icon: Users },
    { title: "Hombres", value: maleParticipants, icon: UserRound },
    { title: "Mujeres", value: femaleParticipants, icon: UserRound },
  ];

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Dashboard de Compañías
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedCompany(company)}
            >
              <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
              <div className="mt-4 flex items-center space-x-2">
                <Badge variant="secondary">
                  Total: {company.participants.length}/10
                </Badge>
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  Hombres:{" "}
                  {company.participants.filter((p) => p.gender === "H").length}
                  /5
                </Badge>
                <Badge className="bg-pink-500 hover:bg-pink-600">
                  Mujeres:{" "}
                  {company.participants.filter((p) => p.gender === "M").length}
                  /5
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Company Details Dialog */}
        <Dialog
          open={!!selectedCompany}
          onOpenChange={() => setSelectedCompany(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedCompany?.name}
                  </h2>
                  <div className="mt-4 flex items-center space-x-2">
                    <Badge variant="secondary">
                      Total: {selectedCompany?.participants.length}/10
                    </Badge>
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      Hombres:{" "}
                      {
                        selectedCompany?.participants.filter(
                          (p) => p.gender === "H"
                        ).length
                      }
                      /5
                    </Badge>
                    <Badge className="bg-pink-500 hover:bg-pink-600">
                      Mujeres:{" "}
                      {
                        selectedCompany?.participants.filter(
                          (p) => p.gender === "M"
                        ).length
                      }
                      /5
                    </Badge>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {selectedCompany?.participants.map((participant) => (
                  <Card key={participant.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {participant.gender === "H" ? (
                          <UserRound className="w-5 h-5 text-blue-500" />
                        ) : (
                          <UserRound className="w-5 h-5 text-pink-500" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{participant.name}</p>
                            <div className="flex items-center text-muted-foreground mb-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {participant.location}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {participant.stake}, {participant.ward}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex items-center",
                          participant.present
                            ? "text-green-500"
                            : "text-gray-400"
                        )}
                      >
                        {participant.present ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
