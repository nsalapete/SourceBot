import { Settings as SettingsIcon, Key, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Settings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure team identity and integration settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Identity</CardTitle>
          <CardDescription>
            Information used in communications and reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              placeholder="e.g., Procurement Team"
              defaultValue="Serica Demo Team"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your team or organization"
              rows={3}
              defaultValue="AI-powered procurement team using Serica"
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure external service integrations (Demo Only)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              ⚠️ For demo purposes only. In production, API keys are securely stored 
              in the Flask backend environment variables.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="claude-key">Claude API Key</Label>
            <Input
              id="claude-key"
              type="password"
              placeholder="sk-ant-..."
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Used by Reporter agent for generating status summaries
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
            <Input
              id="elevenlabs-key"
              type="password"
              placeholder="..."
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Used for voice memo generation in status reports
            </p>
          </div>

          <Button disabled>Save API Keys</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Backend Integration</CardTitle>
              <CardDescription>
                Information about the planned Flask backend
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <h4 className="font-semibold text-sm">Planned Endpoints</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="px-1.5 py-0.5 bg-background rounded">POST /api/start</code> - Start new procurement task</li>
              <li><code className="px-1.5 py-0.5 bg-background rounded">GET /api/status/:taskId</code> - Get task status</li>
              <li><code className="px-1.5 py-0.5 bg-background rounded">POST /api/approve-suppliers</code> - Approve supplier list</li>
              <li><code className="px-1.5 py-0.5 bg-background rounded">GET /api/suppliers</code> - Get all suppliers</li>
              <li><code className="px-1.5 py-0.5 bg-background rounded">GET /api/report/:taskId</code> - Generate voice report</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <h4 className="font-semibold text-sm">Architecture Notes</h4>
            <p className="text-sm text-muted-foreground">
              The Flask backend will orchestrate multi-agent workflows using LangGraph or similar frameworks. 
              Each agent (Planner, Researcher, Communicator, Reporter) will be implemented as a separate module 
              with clearly defined inputs/outputs. The current frontend mock API layer in <code>src/lib/api.ts</code> 
              is designed to be easily replaced with actual fetch calls to these endpoints.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
