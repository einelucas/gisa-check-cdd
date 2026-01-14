import { Book } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RulesModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-14" size="lg">
          <Book className="mr-2 h-5 w-5" />
          Regras
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <Book className="h-5 w-5" />
            Regras de Alimentação
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* Turnos Disponíveis */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">⏰ Turnos Disponíveis</h3>
              <div className="bg-secondary p-3 rounded-lg space-y-2">
                <p className="text-muted-foreground text-xs mb-2">
                  O fim da jornada é definido pelo turno selecionado. Todas as análises são feitas com base no turno escolhido.
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                  <li>05:00 – 14:00</li>
                  <li>07:30 – 17:30</li>
                  <li>08:00 – 17:00</li>
                  <li>13:00 – 22:00</li>
                  <li>14:00 – 23:00</li>
                  <li>20:00 – 05:00 <span className="text-xs italic">(noturno com virada de dia)</span></li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Obs: Turnos com virada de dia são calculados automaticamente.
                </p>
              </div>
            </section>

            {/* Classificação dos Dias */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">📅 Classificação dos Dias</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Segunda a Sexta:</strong> Dia normal (1º ao 5º dia)</li>
                <li><strong>Sábado:</strong> 6º dia (Folga com compensação)</li>
                <li><strong>Domingo:</strong> 7º dia (DSR)</li>
                <li><strong>Feriados:</strong> Tratar como dia normal</li>
              </ul>
            </section>

            {/* Dia Normal */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">🔹 Dia Normal (Seg-Sex ou Feriado)</h3>
              <p className="text-muted-foreground mb-2">
                <strong>Almoço:</strong> Pago via ticket (não depende de cálculo)
              </p>
              
              <div className="bg-secondary p-3 rounded-lg mb-2">
                <p className="font-medium text-foreground mb-1">Com Deslocamento:</p>
                <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                  <li>Trabalhou após o fim da jornada</li>
                  <li>Retornou após 19:00 (considerando a data de saída original, mesmo com virada de dia)</li>
                  <li>Tempo adicional ≥ 2 horas (contínuo, inclui virada de dia)</li>
                  <li className="font-medium">→ REFEIÇÃO (Jantar)</li>
                </ul>
              </div>
              
              <div className="bg-secondary p-3 rounded-lg">
                <p className="font-medium text-foreground mb-1">Sem Deslocamento:</p>
                <ul className="list-disc list-inside text-muted-foreground text-xs space-y-1">
                  <li>≥ 2h e {"<"} 4h após jornada → <strong>LANCHE</strong></li>
                  <li>≥ 4h após jornada → <strong>REFEIÇÃO (Jantar)</strong></li>
                  <li>{"<"} 2h → Nenhum benefício</li>
                </ul>
              </div>
            </section>

            {/* Sábado */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">🔹 6º Dia — Sábado</h3>
              <div className="bg-secondary p-3 rounded-lg">
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>≥ 4h e {"<"} 8h trabalhadas → <strong>REFEIÇÃO</strong></li>
                  <li>≥ 8h trabalhadas → <strong>REFEIÇÃO INTEGRAL</strong></li>
                  <li>{"<"} 4h → Nenhum benefício</li>
                </ul>
              </div>
            </section>

            {/* Domingo */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">🔹 7º Dia — Domingo (DSR)</h3>
              <div className="bg-secondary p-3 rounded-lg">
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Horas trabalhadas {">"} 0h <strong>com OS atendida</strong> → <strong>REFEIÇÃO INTEGRAL</strong> (Almoço + Jantar)</li>
                  <li>Horas trabalhadas {">"} 0h <strong>sem OS atendida</strong> → Nenhum benefício</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Obs: Por padrão, considera-se que existe OS atendida.
                </p>
              </div>
            </section>

            {/* Valores 2026 */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">💰 Tabela de Valores 2026</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Valores vigentes a partir de 06/01/2026
              </p>
              <div className="bg-secondary p-3 rounded-lg space-y-3">
                <div>
                  <p className="font-medium text-foreground text-xs mb-1">📅 Dias Úteis / Feriado (TRA) - Integral:</p>
                  <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                    <li>Capital / Nacional: R$ 106,32</li>
                    <li>Interior / Estadual: R$ 69,78</li>
                    <li>Corumbá / Ladário: R$ 81,08</li>
                    <li>Bonito: R$ 75,30</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs mb-1">🍽️ Almoço ou Jantar (TRA) - Refeição:</p>
                  <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                    <li>Capital / Nacional: R$ 53,16</li>
                    <li>Interior / Estadual: R$ 34,89</li>
                    <li>Corumbá / Ladário: R$ 40,54</li>
                    <li>Bonito: R$ 37,65</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs mb-1">📅 DSR - Integral:</p>
                  <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                    <li>Capital / Nacional: R$ 149,74</li>
                    <li>Interior / Estadual: R$ 113,20</li>
                    <li>Corumbá / Ladário: R$ 124,48</li>
                    <li>Bonito: R$ 118,74</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs mb-1">🍽️ Almoço + Jantar (DSR) - Refeição:</p>
                  <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                    <li>Capital / Nacional: R$ 74,87</li>
                    <li>Interior / Estadual: R$ 56,60</li>
                    <li>Corumbá / Ladário: R$ 62,24</li>
                    <li>Bonito: R$ 59,37</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs mb-1">🥪 Lanche:</p>
                  <p className="text-muted-foreground text-xs">Valor fixo: R$ 34,89 (independente da localidade)</p>
                </div>
              </div>
            </section>

            {/* Lanche */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">🥪 Lanche — Regra Específica</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Lanche é opcional</li>
                <li>Concedido quando há trabalho após jornada</li>
                <li>Mínimo 2h ininterruptas, menor que 4h</li>
                <li>Valor fixo: R$ 34,89</li>
              </ul>
            </section>

            {/* Observações */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">⚠️ Observações</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Lanche necessita aprovação do gestor e assinatura da supervisão</li>
                <li>Despesas com alimentação estão sujeitas à avaliação do aprovador</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
