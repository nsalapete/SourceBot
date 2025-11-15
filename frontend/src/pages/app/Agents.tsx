import { Activity, Target, Search, Mail, FileText, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Agents() {
  const agents = [
    {
      name: "Analyst Agent",
      icon: LineChart,
      role: "Procurement Intelligence",
      description: "Analyzes procurement needs, identifies risks, and provides strategic insights and reminders to managers",
      status: "active",
      lastAction: "Generated insights",
      lastActionTime: "3 minutes ago",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      name: "Planner Agent",
      icon: Target,
      role: "Workflow Orchestration",
      description: "Breaks down sourcing goals into actionable steps and coordinates agent activities",
      status: "active",
      lastAction: "Created 5-step plan",
      lastActionTime: "2 minutes ago",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Researcher Agent",
      icon: Search,
      role: "Supplier Discovery",
      description: "Scans CRM databases and external sources to identify matching suppliers",
      status: "active",
      lastAction: "Found 5 suppliers",
      lastActionTime: "1 minute ago",
      color: "text-electric",
      bgColor: "bg-electric/10",
    },
    {
      name: "Communicator Agent",
      icon: Mail,
      role: "Outreach Generation",
      description: "Drafts personalized emails tailored to each supplier's profile and capabilities",
      status: "idle",
      lastAction: "Awaiting approval",
      lastActionTime: "5 minutes ago",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      name: "Reporter Agent",
      icon: FileText,
      role: "Status Reporting",
      description: "Generates summaries and voice memos to keep stakeholders informed",
      status: "idle",
      lastAction: "Ready to generate",
      lastActionTime: "10 minutes ago",
      color: "text-orange",
      bgColor: "bg-orange/10",
    },
  ];

  const activityLog = [
    { agent: "Analyst", action: "Needs Analysis", time: "4 min ago", color: "text-warning" },
    { agent: "Analyst", action: "Insights Generated", time: "3 min ago", color: "text-warning" },
    { agent: "Planner", action: "Task Created", time: "2 min ago", color: "text-primary" },
    { agent: "Planner", action: "Plan Generated", time: "2 min ago", color: "text-primary" },
    { agent: "Researcher", action: "Started Research", time: "2 min ago", color: "text-electric" },
    { agent: "Researcher", action: "Suppliers Found", time: "1 min ago", color: "text-electric" },
    { agent: "Manager", action: "Suppliers Approved", time: "30 sec ago", color: "text-success" },
    { agent: "Communicator", action: "Emails Drafted", time: "30 sec ago", color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Multi-Agent System</CardTitle>
              <CardDescription>
                Visualize how specialized AI agents collaborate on procurement tasks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-smooth"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${agent.bgColor}`}>
                    <agent.icon className={`h-6 w-6 ${agent.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{agent.name}</h3>
                      <Badge variant={agent.status === "active" ? "default" : "outline"}>
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <p className="text-sm mb-4">{agent.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last action:</span>
                  <div className="text-right">
                    <p className="font-medium">{agent.lastAction}</p>
                    <p className="text-xs text-muted-foreground">{agent.lastActionTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent Activity Log</CardTitle>
          <CardDescription>
            Chronological view of all agent actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLog.map((log, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${log.color.replace('text-', 'bg-')} mt-2`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {log.agent}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                  <p className="text-sm font-medium">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Note:</strong> This visualization shows the multi-agent architecture. 
            In production, agent activities are orchestrated by the Flask backend with real-time updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
