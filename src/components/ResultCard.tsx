import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getBenefitLabel,
  getLocalityLabel,
  type CalculationResult,
  type BenefitType,
} from "@/lib/meal-calculator";

interface ResultCardProps {
  result: CalculationResult;
}

function getBenefitStyles(benefit: BenefitType): string {
  switch (benefit) {
    case "integral":
      return "bg-[hsl(var(--benefit-integral))] text-[hsl(var(--benefit-integral-foreground))]";
    case "meal":
      return "bg-[hsl(var(--benefit-meal))] text-[hsl(var(--benefit-meal-foreground))]";
    case "snack":
      return "bg-[hsl(var(--benefit-snack))] text-[hsl(var(--benefit-snack-foreground))]";
    case "none":
      return "bg-[hsl(var(--benefit-none))] text-[hsl(var(--benefit-none-foreground))]";
  }
}

function getBenefitIcon(benefit: BenefitType) {
  if (benefit === "none") {
    return <AlertCircle className="h-5 w-5" />;
  }
  return <CheckCircle2 className="h-5 w-5" />;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ResultCard({ result }: ResultCardProps) {
  const {
    benefit,
    totalHours,
    hoursAfterShift,
    dayTypeLabel,
    justification,
    requiresApproval,
    locality,
    benefitValue,
  } = result;

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Resultado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Benefit Badge */}
        <div className="flex justify-center">
          <Badge
            className={cn(
              "text-lg py-2 px-4 font-semibold flex items-center gap-2",
              getBenefitStyles(benefit)
            )}
          >
            {getBenefitIcon(benefit)}
            {getBenefitLabel(benefit)}
          </Badge>
        </div>

        {/* Benefit Value */}
        {benefit !== "none" && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold text-primary">
                {formatCurrency(benefitValue)}
              </span>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Horas Trabalhadas</p>
              <p className="font-semibold text-foreground">
                {totalHours.toFixed(1)}h
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Após Jornada</p>
              <p className="font-semibold text-foreground">
                {hoursAfterShift.toFixed(1)}h
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Tipo do Dia</p>
              <p className="font-semibold text-foreground">{dayTypeLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Localidade</p>
              <p className="font-semibold text-foreground">
                {getLocalityLabel(locality)}
              </p>
            </div>
          </div>
        </div>

        {/* Justification */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-foreground">{justification}</p>
        </div>

        {/* Approval Notice for Snack */}
        {requiresApproval && (
          <div className="p-3 bg-[hsl(var(--benefit-snack)/0.15)] border border-[hsl(var(--benefit-snack))] rounded-lg">
            <p className="text-sm text-foreground flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-[hsl(var(--benefit-snack))] mt-0.5 shrink-0" />
              <span>
                <strong>Atenção:</strong> O lanche necessita de aprovação do
                gestor e assinatura da supervisão.
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
