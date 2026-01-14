import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Calculator, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  calculateMealBenefit,
  SHIFTS,
  LOCALITIES,
  type CalculationResult,
  type ShiftType,
  type LocalityType,
} from "@/lib/meal-calculator";
import { ResultCard } from "./ResultCard";
import { RulesModal } from "./RulesModal";

export function MealCalculator() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedShift, setSelectedShift] = useState<ShiftType | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<LocalityType | null>(
    null
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hadDisplacement, setHadDisplacement] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleShiftChange = (shiftLabel: string) => {
    const shift = SHIFTS.find((s) => s.label === shiftLabel);
    if (shift) {
      setSelectedShift(shift);
    }
  };

  const handleLocalityChange = (localityValue: string) => {
    setSelectedLocality(localityValue as LocalityType);
  };

  const handleCalculate = () => {
    if (
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !selectedShift ||
      !selectedLocality
    )
      return;

    const calculationResult = calculateMealBenefit(
      startDate,
      startTime,
      endDate,
      endTime,
      selectedShift,
      selectedLocality,
      hadDisplacement
    );
    setResult(calculationResult);
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedShift(null);
    setSelectedLocality(null);
    setStartTime("");
    setEndTime("");
    setHadDisplacement(false);
    setResult(null);
  };

  const isFormValid =
    startDate &&
    endDate &&
    startTime &&
    endTime &&
    selectedShift &&
    selectedLocality;

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <UtensilsCrossed className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">CDD Check</h1>
        <p className="text-sm text-muted-foreground">
          Informe os dados do turno para verificar o direito à alimentação
        </p>
      </div>

      {/* Form Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Dados do Turno
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shift Select - FIRST */}
          <div className="space-y-2">
            <Label htmlFor="shift" className="text-sm font-medium">
              Turno
            </Label>
            <Select
              value={selectedShift?.label || ""}
              onValueChange={handleShiftChange}
            >
              <SelectTrigger id="shift" className="h-12">
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                {SHIFTS.map((shift) => (
                  <SelectItem key={shift.label} value={shift.label}>
                    {shift.label}
                    {shift.crossesMidnight && " (noturno)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Locality Select - SECOND */}
          <div className="space-y-2">
            <Label htmlFor="locality" className="text-sm font-medium">
              Localidade
            </Label>
            <Select
              value={selectedLocality || ""}
              onValueChange={handleLocalityChange}
            >
              <SelectTrigger id="locality" className="h-12">
                <SelectValue placeholder="Selecione a localidade" />
              </SelectTrigger>
              <SelectContent>
                {LOCALITIES.map((locality) => (
                  <SelectItem key={locality.value} value={locality.value}>
                    {locality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium">
              Data de Entrada
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    if (!endDate && date) setEndDate(date);
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <Label htmlFor="start-time" className="text-sm font-medium">
              Horário de Entrada
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-sm font-medium">
              Data de Saída
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate
                    ? format(endDate, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label htmlFor="end-time" className="text-sm font-medium">
              Horário de Saída
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Displacement Checkbox */}
          <div className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
            <Checkbox
              id="displacement"
              checked={hadDisplacement}
              onCheckedChange={(checked) =>
                setHadDisplacement(checked === true)
              }
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="displacement"
                className="text-sm font-medium cursor-pointer"
              >
                Houve deslocamento após o fim da jornada
              </Label>
              <p className="text-xs text-muted-foreground">
                Marque se saiu para atendimento externo após o fim do turno
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCalculate}
              disabled={!isFormValid}
              className="flex-1 h-14 text-lg font-semibold"
              size="lg"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calcular
            </Button>
            <RulesModal />
          </div>

          {result && (
            <Button
              onClick={handleClear}
              variant="ghost"
              className="w-full"
              size="sm"
            >
              Limpar e recalcular
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Result */}
      {result && <ResultCard result={result} />}

      {/* Fixed Notice */}
      <p className="text-xs text-center text-muted-foreground px-4">
        Despesas com alimentação estão sujeitas à avaliação do aprovador.
        Valores vigentes a partir de 06/01/2026.
      </p>
    </div>
  );
}
