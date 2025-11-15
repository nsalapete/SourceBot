import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  RefreshCw,
  CheckCircle2,
  Clock,
  Mic,
  Loader2,
} from "lucide-react";
import { useBackend } from "@/hooks/useBackend";
import { getVoiceReport } from "@/lib/backendApi";

export default function Overview() {
  const { toast } = useToast();
  const [goal, setGoal] = useState("");
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Use real backend
  const { state, loading, submitGoal, executeResearch, approveFindings, resetWorkflow, fetchState } = useBackend();

  // Auto-refresh state every 3 seconds when workflow is active
  useEffect(() => {
    if (state && state.status !== 'idle' && state.status !== 'completed') {
      const interval = setInterval(() => {
        fetchState();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [state, fetchState]);

  const handleStartTask = async () => {
    if (!goal.trim()) {
      toast({
        title: "Error",
        description: "Please enter a sourcing goal",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitGoal(goal);
      // Auto-trigger research after goal submission
      setTimeout(() => {
        executeResearch();
      }, 1500);
    } catch (error) {
      // Error already handled by useBackend hook
    }
  };

  const handleRefreshStatus = async () => {
    await fetchState();
  };

  const handleApprove = async () => {
    try {
      await approveFindings(true);
    } catch (error) {
      // Error already handled
    }
  };

  const handleReject = async () => {
    try {
      await approveFindings(false);
    } catch (error) {
      // Error already handled
    }
  };

  const handleGenerateVoiceReport = async () => {
    if (!state) return;

    setGeneratingReport(true);
    try {
      const audioBlob = await getVoiceReport();
      const audioUrl = URL.createObjectURL(audioBlob);
      setVoiceAudioUrl(audioUrl);
      toast({
        title: "Voice Report Generated",
        description: "Status summary created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetWorkflow();
      setGoal("");
      setVoiceAudioUrl(null);
    } catch (error) {
      // Error already handled by useBackend hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'secondary';
      case 'planning': return 'default';
      case 'researching': return 'default';
      case 'reviewing': return 'default';
      case 'drafting': return 'default';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Multi-agent AI procurement workflow
        </p>
      </div>

      {/* Backend Connection Status */}
      {state && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Backend Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              <Badge variant={getStatusColor(state.status)}>
                {state.status}
              </Badge>
            </div>
            {state.goal && (
              <p className="text-sm text-muted-foreground mt-2">
                Goal: {state.goal}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goal Input */}
      <Card>
        <CardHeader>
          <CardTitle>Sourcing Goal</CardTitle>
          <CardDescription>
            Define your procurement requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Source 10,000 units of electronics components"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="resize-none"
            disabled={state?.status !== 'idle'}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              onClick={handleStartTask} 
              disabled={loading || !goal.trim() || state?.status !== 'idle'}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Task
                </>
              )}
            </Button>
            
            {state && state.status !== 'idle' && (
              <Button variant="outline" onClick={handleRefreshStatus} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            )}

            {state && (state.status === 'awaiting_approval' || state.status === 'reviewing') && (
              <>
                <Button variant="default" onClick={handleApprove} disabled={loading}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve Findings
                </Button>
                <Button variant="outline" onClick={handleReject} disabled={loading}>
                  Reject & Restart
                </Button>
              </>
            )}

            {state && state.status !== 'idle' && (
              <Button variant="outline" onClick={handleReset} disabled={loading}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan */}
      {state && state.plan && state.plan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Execution Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {state.plan.map((step, index) => {
                // Handle both string and object formats
                const stepContent = typeof step === 'string' ? step : step.title || step.description;
                const stepStatus = typeof step === 'object' ? step.status : undefined;
                
                return (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                    {stepStatus && (
                      <Badge variant={stepStatus === 'completed' ? 'default' : 'outline'}>
                        {stepStatus}
                      </Badge>
                    )}
                    <p className="text-sm font-medium flex-1">
                      Step {typeof step === 'object' && step.step_number ? step.step_number : index + 1}: {stepContent}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Findings */}
      {state && state.findings && (
        <Card>
          <CardHeader>
            <CardTitle>Research Findings</CardTitle>
            <CardDescription>AI-powered supplier analysis results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statistics Summary */}
            {state.findings.statistics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">
                    {state.findings.statistics.total_products || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Products</div>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">
                    {state.findings.statistics.unique_suppliers || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Unique Suppliers</div>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-600">
                    {state.findings.statistics.total_sales_transactions || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Sales Transactions</div>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-2xl font-bold text-amber-600">
                    €{(state.findings.statistics.total_revenue || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Revenue</div>
                </div>
              </div>
            )}

            {/* Additional Stats Row */}
            {state.findings.statistics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-600">
                    €{(state.findings.statistics.total_profit || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Profit</div>
                </div>
                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <div className="text-2xl font-bold text-pink-600">
                    {state.findings.statistics.avg_profit_margin?.toFixed(1) || 'N/A'}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Profit Margin</div>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-2xl font-bold text-cyan-600">
                    €{(state.findings.statistics.avg_trade_price || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Trade Price</div>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-600">
                    €{(state.findings.statistics.avg_rrp || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg RRP</div>
                </div>
              </div>
            )}

            {/* Department Breakdown */}
            {state.findings.statistics?.departments && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Products by Department</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(state.findings.statistics.departments).slice(0, 8).map(([dept, count]) => (
                    <div key={dept} className="p-3 rounded-lg bg-muted/50 border">
                      <div className="font-semibold text-sm">{dept}</div>
                      <div className="text-xl font-bold text-primary">{count as number}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Suppliers */}
            {state.findings.statistics?.top_suppliers && state.findings.statistics.top_suppliers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Top Suppliers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {state.findings.statistics.top_suppliers.slice(0, 3).map((supplier: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                      <div className="font-bold text-lg">{supplier.supplier}</div>
                      <div className="text-sm text-muted-foreground">{supplier.product_count} products</div>
                      <div className="text-sm font-semibold text-primary mt-1">
                        €{(supplier.total_sales || 0).toLocaleString()} sales
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {state.findings.summary && (
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Analysis Summary
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {state.findings.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Relevant Suppliers/Products */}
            {state.findings.relevant_suppliers && state.findings.relevant_suppliers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Recommended Products & Suppliers</h4>
                <div className="space-y-3">
                  {state.findings.relevant_suppliers.map((item: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg">{item.product}</h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium text-primary">Supplier:</span> {item.supplier}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Department:</span> {item.department}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Trade Price</div>
                          <div className="font-semibold">€{item.trade_price?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">RRP</div>
                          <div className="font-semibold">€{item.rrp?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Stock Level</div>
                          <div className="font-semibold">{item.stock_level || 0}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Qty Sold</div>
                          <div className="font-semibold">{item.qty_sold || 0}</div>
                        </div>
                      </div>

                      {(item.turnover || item.profit) && (
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          {item.turnover && (
                            <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                              <div className="text-xs text-green-700 dark:text-green-300">Turnover</div>
                              <div className="font-semibold text-green-900 dark:text-green-100">€{item.turnover?.toFixed(2)}</div>
                            </div>
                          )}
                          {item.profit && (
                            <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                              <div className="text-xs text-blue-700 dark:text-blue-300">Profit</div>
                              <div className="font-semibold text-blue-900 dark:text-blue-100">€{item.profit?.toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {item.reason && (
                        <div className="pt-3 border-t">
                          <p className="text-sm text-muted-foreground italic">
                            {item.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Drafts */}
      {state && state.drafts && state.drafts.emails && (
        <Card>
          <CardHeader>
            <CardTitle>Email Drafts</CardTitle>
            <CardDescription>
              {state.drafts.emails.length} automated outreach emails ready for review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.drafts.emails.map((email: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-base">{email.supplier_name}</h5>
                      <Badge variant="outline" className="text-xs">
                        {email.supplier_id}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>
                        <span className="font-medium">To:</span> {email.to}
                      </div>
                      <div>
                        <span className="font-medium">Subject:</span> {email.subject}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                    Draft #{index + 1}
                  </Badge>
                </div>
                
                <div className="p-3 rounded-md bg-muted/30 border border-dashed">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {email.body}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Voice Report */}
      {state && state.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Voice Report</CardTitle>
            <CardDescription>Generate an AI voice summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGenerateVoiceReport}
              disabled={generatingReport}
            >
              {generatingReport ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Generate Voice Report
                </>
              )}
            </Button>

            {voiceAudioUrl && (
              <audio controls className="w-full" src={voiceAudioUrl}>
                Your browser does not support audio playback.
              </audio>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
