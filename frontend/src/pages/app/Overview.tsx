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
                    {state.findings.statistics.total_suppliers || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Suppliers</div>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">
                    {state.findings.statistics.active_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Active Suppliers</div>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-600">
                    {state.findings.statistics.high_rated_electronics_suppliers || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">High Rated</div>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-2xl font-bold text-amber-600">
                    {state.findings.statistics.average_rating?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Rating</div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {state.findings.statistics?.by_category && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Suppliers by Category</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(state.findings.statistics.by_category).map(([category, count]) => (
                    <div key={category} className="p-3 rounded-lg bg-muted/50 border">
                      <div className="font-semibold text-sm capitalize">{category}</div>
                      <div className="text-xl font-bold text-primary">{count as number}</div>
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

            {/* Relevant Suppliers */}
            {state.findings.relevant_suppliers && state.findings.relevant_suppliers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Recommended Suppliers</h4>
                <div className="space-y-3">
                  {state.findings.relevant_suppliers.map((supplier: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-semibold">{supplier.name}</h5>
                          <p className="text-xs text-muted-foreground">ID: {supplier.id}</p>
                        </div>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                          {supplier.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>{' '}
                          <span className="font-medium capitalize">{supplier.category}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating:</span>{' '}
                          <span className="font-medium">{supplier.rating} ⭐</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Country:</span>{' '}
                          <span className="font-medium">{supplier.country}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Contact:</span>{' '}
                          <span className="font-medium text-xs">{supplier.contact_email}</span>
                        </div>
                      </div>
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
