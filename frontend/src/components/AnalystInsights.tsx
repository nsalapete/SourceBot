import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Shield, Clock } from "lucide-react";

export interface AnalystInsight {
  type: 'risk' | 'opportunity' | 'recommendation' | 'timeline';
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
}

interface AnalystInsightsProps {
  insights: AnalystInsight[];
}

const getIcon = (type: AnalystInsight['type']) => {
  switch (type) {
    case 'risk':
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case 'opportunity':
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    case 'recommendation':
      return <Shield className="h-5 w-5 text-blue-600" />;
    case 'timeline':
      return <Clock className="h-5 w-5 text-purple-600" />;
  }
};

const getSeverityColor = (severity?: AnalystInsight['severity']) => {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
};

export default function AnalystInsights({ insights }: AnalystInsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Analyst Insights
        </CardTitle>
        <CardDescription>
          Strategic analysis and recommendations from the Analyst Agent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-3 p-3 rounded-lg border bg-card">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(insight.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">{insight.title}</h4>
                {insight.severity && (
                  <Badge variant={getSeverityColor(insight.severity)}>
                    {insight.severity}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { AnalystInsights };
