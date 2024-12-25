"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  Users,
  UserIcon as Male,
  UserIcon as Female,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Stake = "Santa Clara" | "Vitarte" | "Chosica" | "Chaclacayo";
type Ward = "Barrio 1" | "Barrio 2" | "Barrio 3" | "Barrio 4";

type Participant = {
  id: number;
  name: string;
  gender: "male" | "female";
  attended: boolean;
  stake: Stake;
  ward: Ward;
};

type Company = {
  id: number;
  name: string;
  total: number;
  men: number;
  women: number;
  participants: Participant[];
};

const stakes: Stake[] = ["Santa Clara", "Vitarte", "Chosica", "Chaclacayo"];
const wards: Ward[] = ["Barrio 1", "Barrio 2", "Barrio 3", "Barrio 4"];

const firstNames = [
  "Juan",
  "María",
  "Carlos",
  "Ana",
  "Luis",
  "Sofía",
  "Pedro",
  "Laura",
  "Miguel",
  "Isabel",
  "José",
  "Carmen",
  "Fernando",
  "Patricia",
  "Ricardo",
  "Elena",
];

const lastNames = [
  "García",
  "Rodríguez",
  "López",
  "Martínez",
  "González",
  "Pérez",
  "Sánchez",
  "Ramírez",
  "Torres",
  "Flores",
  "Rivera",
  "Gómez",
  "Díaz",
  "Reyes",
  "Morales",
  "Cruz",
];

function getRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

const companies: Company[] = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  name: `Compañía ${i + 1}`,
  total: Math.floor(Math.random() * 50) + 10,
  men: Math.floor(Math.random() * 25) + 5,
  women: Math.floor(Math.random() * 25) + 5,
  participants: Array.from(
    { length: Math.floor(Math.random() * 50) + 10 },
    (_, j) => ({
      id: j + 1,
      name: getRandomName(),
      gender: Math.random() > 0.5 ? "male" : "female",
      attended: Math.random() > 0.5,
      stake: stakes[Math.floor(Math.random() * stakes.length)],
      ward: wards[Math.floor(Math.random() * wards.length)],
    })
  ),
}));

export default function Dashboard() {
  const [companiesData, setCompaniesData] = useState<Company[]>(companies);

  const totalCompanies = companiesData.length;
  const totalEmployees = companiesData.reduce(
    (sum, company) => sum + company.total,
    0
  );
  const totalMen = companiesData.reduce((sum, company) => sum + company.men, 0);
  const totalWomen = companiesData.reduce(
    (sum, company) => sum + company.women,
    0
  );

  const toggleAttendance = (companyId: number, participantId: number) => {
    setCompaniesData((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === companyId
          ? {
              ...company,
              participants: company.participants.map((participant) =>
                participant.id === participantId
                  ? { ...participant, attended: !participant.attended }
                  : participant
              ),
            }
          : company
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Dashboard de Compañías
        </h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <SummaryCard
            title="Total Compañías"
            value={totalCompanies}
            icon={Building2}
            color="text-blue-600"
          />
          <SummaryCard
            title="Total Empleados"
            value={totalEmployees}
            icon={Users}
            color="text-green-600"
          />
          <SummaryCard
            title="Total Hombres"
            value={totalMen}
            icon={Male}
            color="text-indigo-600"
          />
          <SummaryCard
            title="Total Mujeres"
            value={totalWomen}
            icon={Female}
            color="text-purple-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companiesData.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              toggleAttendance={toggleAttendance}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="border-t-4" style={{ borderTopColor: `var(--${color})` }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800">
          {value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyCard({ company, toggleAttendance }) {
  const sortedParticipants = useMemo(() => {
    const women = company.participants.filter((p) => p.gender === "female");
    const men = company.participants.filter((p) => p.gender === "male");
    return [...women, ...men];
  }, [company.participants]);

  const attendedWomen = useMemo(
    () =>
      company.participants.filter((p) => p.gender === "female" && p.attended)
        .length,
    [company.participants]
  );

  const attendedMen = useMemo(
    () =>
      company.participants.filter((p) => p.gender === "male" && p.attended)
        .length,
    [company.participants]
  );

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-gray-100">
        <CardTitle className="text-lg text-gray-800">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-lg text-gray-800"
              >
                {company.name}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{company.name} - Participantes</DialogTitle>
              </DialogHeader>
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center ">
                  <Female className="h-4 w-4 text-purple-500 mr-1" />
                  Mujeres - ({attendedWomen}/{company.women})
                </span>
                <span className="flex items-center">
                  ({attendedMen}/{company.men}) - Hombres
                  <Male className="h-4 w-4 text-blue-500 ml-1" />
                </span>
              </div>
              <Separator />
              <ScrollArea className="h-[50vh] w-full pr-4">
                {sortedParticipants.map((participant, index) => (
                  <div key={participant.id}>
                    {index === company.women && <Separator className="my-2" />}
                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2">
                        {participant.gender === "male" ? (
                          <Male className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Female className="h-4 w-4 text-purple-500" />
                        )}
                        <span className="relative text-sm">
                          {participant.name}
                          <sup className="absolute top-0 left-full ml-1 text-xs text-gray-500 whitespace-nowrap">
                            ({participant.stake} - {participant.ward})
                          </sup>
                        </span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleAttendance(company.id, participant.id)
                        }
                        className={
                          participant.attended
                            ? "text-green-500 hover:text-green-600"
                            : "text-gray-400 hover:text-gray-500"
                        }
                      >
                        {participant.attended ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <X className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="flex justify-between items-center mb-2 p-2 border-b">
          <span className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2 text-gray-400" />
            Total
          </span>
          <span className="font-bold text-gray-800">{company.total}</span>
        </div>
        <div className="flex justify-between items-center mb-2 p-2">
          <span className="flex items-center text-gray-600">
            <Male className="h-5 w-5 mr-2 text-blue-400" />
            Hombres
          </span>
          <span className="text-gray-800">{company.men}</span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="flex items-center text-gray-600">
            <Female className="h-5 w-5 mr-2 text-purple-400" />
            Mujeres
          </span>
          <span className="text-gray-800">{company.women}</span>
        </div>
      </CardContent>
    </Card>
  );
}
