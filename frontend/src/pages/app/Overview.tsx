import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  RefreshCw,
  CheckCircle2,
  Clock,
  Circle,
  Mic,
  Mail,
  Building2,
  Loader2,
} from "lucide-react";
import * as api from "@/lib/api";
import AnalystInsights from "@/components/AnalystInsights";

export default function Overview() {
  const { toast } = useToast();
  const [goal, setGoal] = useState("");
  const [task, setTask] = useState<api.Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [voiceReport, setVoiceReport] = useState<api.VoiceReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleStartTask = async () => {
    if (!goal.trim()) {
      toast({
        title: "Error",
        description: "Please enter a sourcing goal",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newTask = await api.startTask(goal);
      setTask(newTask);
      toast({
        title: "Task Started",
        description: "Multi-agent workflow initiated",
      });

      // Simulate progress: fetch status after delay
      setTimeout(async () => {
        const updated = await api.getStatus(newTask.id);
        setTask(updated);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!task) return;
    
    setLoading(true);
    try {
      const updated = await api.getStatus(task.id);
      setTask(updated);
      toast({
        title: "Status Updated",
        description: "Latest task status retrieved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSuppliers = async () => {
    if (!task || selectedSuppliers.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one supplier",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const updated = await api.approveSuppliers(task.id, selectedSuppliers);
      setTask(updated);
      toast({
        title: "Suppliers Approved",
        description: `${selectedSuppliers.length} suppliers approved and emails drafted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve suppliers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVoiceReport = async () => {
    if (!task) return;

    setGeneratingReport(true);
    try {
      const report = await api.getVoiceReport(task.id);
      setVoiceReport(report);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-warning animate-pulse-glow" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      done: "default",
      in_progress: "secondary",
      pending: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Analyst Insights - Always visible */}
      <AnalystInsights goal={goal || task?.goal} />

      {/* Goal Input */}
      <Card>
        <CardHeader>
          <CardTitle>Sourcing Goal</CardTitle>
          <CardDescription>
            Define your procurement requirements and let the AI agents handle the rest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Source 10,000 units of electronics components by March 31"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex items-center gap-2">
            <Button onClick={handleStartTask} disabled={loading || !goal.trim()}>
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
            {task && (
              <Button variant="outline" onClick={handleRefreshStatus} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            💡 In production, this will call a Flask backend orchestrator
          </p>
        </CardContent>
      </Card>

      {task && (
        <>
          {/* Plan & Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Planned Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      {getStatusIcon(step.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{step.name}</p>
                          {getStatusBadge(step.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.logs.slice().reverse().map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {log.agent}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers */}
          {task.suppliers.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Supplier Recommendations
                    </CardTitle>
                    <CardDescription>
                      Select suppliers to approve for outreach
                    </CardDescription>
                  </div>
                  {!task.emails.length && (
                    <Button 
                      onClick={handleApproveSuppliers} 
                      disabled={selectedSuppliers.length === 0 || loading}
                    >
                      Approve Selected ({selectedSuppliers.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>MOQ</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Match</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {task.suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <Checkbox
                            checked={supplier.approved || selectedSuppliers.includes(supplier.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSuppliers([...selectedSuppliers, supplier.id]);
                              } else {
                                setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplier.id));
                              }
                            }}
                            disabled={supplier.approved}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.country}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{supplier.rating} ⭐</Badge>
                        </TableCell>
                        <TableCell>{supplier.moq}</TableCell>
                        <TableCell>{supplier.leadTime}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary/10 text-primary">
                            {supplier.matchScore}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Email Drafts */}
          {task.emails.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Draft Emails
                </CardTitle>
                <CardDescription>
                  Review and approve outreach emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.emails.map((email) => (
                    <div key={email.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{email.supplierName}</p>
                          <p className="text-sm text-muted-foreground">{email.subject}</p>
                        </div>
                        {getStatusBadge(email.status)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {email.body}
                      </p>
                      <Button variant="outline" size="sm">
                        View Full Email
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  💡 In production, approved emails would be sent via your CRM/email system
                </p>
              </CardContent>
            </Card>
          )}

          {/* Voice Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Status Voice Report
              </CardTitle>
              <CardDescription>
                Generate an AI-powered voice memo of current status
              </CardDescription>
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
                  "Get Voice Report"
                )}
              </Button>

              {voiceReport && (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm">{voiceReport.summary}</p>
                  </div>
                  <audio controls className="w-full" src={voiceReport.audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                  <p className="text-xs text-muted-foreground">
                    💡 Audio is mocked; production will use Claude + ElevenLabs for real voice generation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
