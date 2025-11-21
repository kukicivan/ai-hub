import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AIAnalysis {
  status?: "new" | "processing" | "completed" | "failed";
  sentiment?: "positive" | "neutral" | "negative" | "urgent";
  priority?: "high" | "medium" | "low";
  summary: string;
  recommendation?: string;
  confidence?: number;
  actionItems?: string[];
}

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
  className?: string;
}

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
};

const sentimentColors = {
  positive: "bg-emerald-100 text-emerald-800 border-emerald-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
  negative: "bg-rose-100 text-rose-800 border-rose-200",
  urgent: "bg-orange-100 text-orange-800 border-orange-200",
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-slate-100 text-slate-800 border-slate-200",
};

const statusLabels = {
  new: "Novo",
  processing: "Obrađuje se",
  completed: "Završeno",
  failed: "Greška",
};

const sentimentLabels = {
  positive: "Pozitivan",
  neutral: "Neutralan",
  negative: "Negativan",
  urgent: "Hitno",
};

const priorityLabels = {
  high: "Visok",
  medium: "Srednji",
  low: "Nizak",
};

export function AIAnalysisCard({ analysis, className = "" }: AIAnalysisCardProps) {
  return (
    <Card className={`border-l-4 border-l-primary ${className}`}>
      <CardContent className="pt-6 space-y-4">
        {/* Header sa badge-ovima */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-primary font-medium">
            <span className="text-lg">🤖</span>
            <span className="text-sm">AI Analiza</span>
          </div>

          {/* Badge-ovi */}
          {analysis.status && (
            <Badge variant="outline" className={`${statusColors[analysis.status]} font-medium`}>
              {statusLabels[analysis.status]}
            </Badge>
          )}

          {analysis.sentiment && (
            <Badge
              variant="outline"
              className={`${sentimentColors[analysis.sentiment]} font-medium`}
            >
              {sentimentLabels[analysis.sentiment]}
            </Badge>
          )}

          {analysis.priority && (
            <Badge variant="outline" className={`${priorityColors[analysis.priority]} font-medium`}>
              Prioritet: {priorityLabels[analysis.priority]}
            </Badge>
          )}
        </div>

        {/* Sumarizacija */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Sažetak
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{analysis.summary}</p>
        </div>

        {/* Rekomendacija */}
        {analysis.recommendation && (
          <div className="space-y-2 p-3 bg-accent/50 rounded-lg border border-accent">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                💡 Preporučena akcija
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{analysis.recommendation}</p>
          </div>
        )}

        {/* Action Items */}
        {analysis.actionItems && analysis.actionItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                ✓ Sugerisane akcije
              </span>
            </div>
            <ul className="space-y-1.5 ml-1">
              {analysis.actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Confidence Footer */}
        {analysis.confidence !== undefined && (
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>✓ Analiza završena</span>
            <span className="flex items-center gap-1">
              <span>Pouzdanost:</span>
              <span className="font-semibold text-foreground">
                {Math.round(analysis.confidence * 100)}%
              </span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
