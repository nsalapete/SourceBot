import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as api from "@/lib/api";
import { Loader2, CheckSquare } from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState<api.Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTaskHistory();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      planning: { variant: "outline", label: "Planning" },
      researching: { variant: "secondary", label: "Researching" },
      awaiting_approval: { variant: "secondary", label: "Awaiting Approval" },
      completed: { variant: "default", label: "Completed" },
    };

    const { variant, label } = config[status] || { variant: "outline", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Task History</CardTitle>
              <CardDescription>
                All procurement tasks created in this session
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks yet. Start one from the Overview page!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Goal</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Suppliers</TableHead>
                  <TableHead>Emails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium max-w-md">
                      <p className="line-clamp-2">{task.goal}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(task.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(task.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {task.suppliers.length} found
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {task.emails.length} drafted
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Note:</strong> In production, task data will persist in a database 
            and you'll be able to click on tasks to view full details, export reports, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
