import { HelpCircle, Play, CheckCircle2, Mail, Mic, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Help() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Play,
      title: "Set a sourcing goal",
      description: "Navigate to the Overview page and enter your procurement requirements in the goal input area.",
      cta: "Go to Overview",
      path: "/app",
    },
    {
      icon: CheckCircle2,
      title: "Review supplier recommendations",
      description: "The Researcher agent will identify potential suppliers. Review their match scores and select the best candidates.",
      cta: "View Suppliers",
      path: "/app/suppliers",
    },
    {
      icon: Mail,
      title: "Approve draft emails",
      description: "The Communicator agent drafts personalized outreach. Review and approve emails before sending.",
      cta: "View Emails",
      path: "/app/emails",
    },
    {
      icon: Mic,
      title: "Generate voice reports",
      description: "Get AI-generated status updates with voice memos summarizing progress and next steps.",
      cta: "Back to Overview",
      path: "/app",
    },
  ];

  const faqs = [
    {
      question: "Is this connected to real CRMs?",
      answer: "Not yet. The current build uses mocked data to demonstrate the multi-agent workflow. In production, SourceBot will integrate with your actual CRM system, supplier databases, and email platforms.",
    },
    {
      question: "Where is the multi-agent logic implemented?",
      answer: "The agent orchestration is planned for a Flask backend using frameworks like LangGraph. The current frontend is structured to easily plug into these backend endpoints once they're built.",
    },
    {
      question: "Can I actually send emails from this demo?",
      answer: "No, email sending is simulated. In production, approved emails would be sent via your configured email service (SendGrid, Mailgun, SMTP, etc.).",
    },
    {
      question: "How does the voice report work?",
      answer: "Currently, the voice report is mocked with placeholder audio. The production version will use Claude for text generation and ElevenLabs for voice synthesis.",
    },
    {
      question: "What happens to the data I enter?",
      answer: "In this demo, all data is stored in browser memory and lost on refresh. A production deployment would persist data in a database.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Help & Walkthrough</CardTitle>
              <CardDescription>
                Learn how to use SourceBot and understand the demo flow
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to experience the full multi-agent workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(step.path)}
                  >
                    {step.cta}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">Need more help?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            This is a hackathon demo showcasing the potential of multi-agent AI for procurement. 
            For production deployment questions or custom implementations, please contact the development team.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Documentation
            </Button>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
