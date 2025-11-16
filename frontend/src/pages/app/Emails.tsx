import { CheckCircle2, Copy, Mail, Send, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

type EmailDraft = {
  id: string;
  supplier: string;
  subject: string;
  summary: string;
  highlight: string;
  insight: string;
  fullContent: string;
};

const mockEmails: EmailDraft[] = [
  {
    id: "1",
    supplier: "TechParts Global",
    subject: "Partnership Inquiry - Electronics Components",
    summary: "Bulk-ready electronics assortment with competitive pricing tiers.",
    highlight: "High response rate",
    insight: "Matched forecasted Q1 needs for circuit boards and connectors.",
    fullContent: `Dear TechParts Global Team,

We are reaching out regarding a procurement opportunity for electronics components this quarter. Our company is currently seeking reliable suppliers for the following items:

- Circuit boards (various specifications)
- Semiconductor components
- Electronic connectors and cables
- Power supply units

We would like to discuss:
1. Your current product catalog and availability
2. Pricing structure for bulk orders (1000+ units)
3. Lead times and shipping options
4. Quality certifications and compliance standards

Please let us know your availability for a call next week to discuss this opportunity in detail.`
  },
  {
    id: "2",
    supplier: "Asia Components Ltd",
    subject: "Partnership Inquiry - Electronics Components",
    summary: "ISO-certified supplier with flexible MOQ and North America shipping.",
    highlight: "Preferred for compliance",
    insight: "Covers passive components gap flagged by Planner agent.",
    fullContent: `Dear Asia Components Ltd Team,

We believe there may be a strong partnership opportunity after reviewing your company profile and capabilities.

Our requirements include:
- High-quality electronic components with ISO certification
- Flexible order quantities (starting at 500 units)
- Competitive pricing with volume discounts
- Reliable shipping to North America

We are particularly interested in:
- Microcontrollers and processors
- Passive components (resistors, capacitors)
- LED components and displays
- Sensor modules

Looking forward to your response.`
  },
  {
    id: "3",
    supplier: "Northwind Electronics",
    subject: "Compliance-ready electronics sourcing",
    summary: "Certified batches available with 14-day lead time.",
    highlight: "Fast availability",
    insight: "Ideal for the backorder of sensor modules in Retail program.",
    fullContent: `Dear Northwind Electronics,

We noticed your compliance track record and would like to explore a supply collaboration for certified electronics components. Please share catalog, batch availability, and lead times so we can align on the upcoming project.`
  },
  {
    id: "4",
    supplier: "Quantum Supplies",
    subject: "RFQ - Precision Power Components",
    summary: "Precision power units ready to ship from EU warehouse.",
    highlight: "Expedite option",
    insight: "Bridges the urgent power-unit shortage highlighted yesterday.",
    fullContent: `Dear Quantum Supplies,

We are issuing an RFQ for precision power components with aggressive lead times. Please confirm your current inventory and pricing for batch orders.`
  },
  {
    id: "5",
    supplier: "ElectroLink Group",
    subject: "High-volume procurement opportunity",
    summary: "Connector and PCB partner open to multi-year pricing locks.",
    highlight: "Long-term fit",
    insight: "Supports cost optimization scenario recommended by Finance assistant.",
    fullContent: `Dear ElectroLink Group,

Our procurement team is evaluating long-term high-volume contracts for connectors and PCBs. We'd like to understand volume pricing, delivery cadence, and service level agreements.`
  },
  {
    id: "6",
    supplier: "Atlas Components",
    subject: "Compliance-ready semiconductor supply",
    summary: "Semiconductor lots with complete certification packets ready.",
    highlight: "Audit ready",
    insight: "Audit trail aligns with automotive compliance checklist.",
    fullContent: `Dear Atlas Components,

We are preparing for a large semiconductor buy and need certification plus compliance documentation. Please let us know which product lines are ready for immediate delivery.`
  },
];

const VISIBLE_COUNT = 3;

const statusOrder: Record<string, "draft" | "approved" | "sent"> = {
  "1": "draft",
  "2": "approved",
  "3": "draft",
  "4": "draft",
  "5": "draft",
  "6": "draft",
};

// Default signature values from Account.tsx
const defaultSignature = {
  fullName: "Nicolas Salapete",
  enterprise: "SERICA",
  jobTitle: "CEO",
};

// Append default signature if missing
const appendSignatureIfMissing = (content: string) => {
  const signaturePattern = /Best regards,|Sincerely,|Regards,|Thank you,/i;
  if (signaturePattern.test(content)) return content;
  return `${content}\n\nBest regards,\n${defaultSignature.fullName}\n${defaultSignature.jobTitle} at ${defaultSignature.enterprise}`;
};

export default function Emails() {
  const { toast } = useToast();
  const [showAllDrafts, setShowAllDrafts] = useState(false);
  const [emailStatuses, setEmailStatuses] = useState<Record<string, "draft" | "approved" | "sent">>(statusOrder);

  const totals = useMemo(() => {
    const values = Object.values(emailStatuses);
    return {
      total: values.length,
      approved: values.filter(status => status === "approved").length,
      sent: values.filter(status => status === "sent").length,
    };
  }, [emailStatuses]);

  const displayedEmails = showAllDrafts ? mockEmails : mockEmails.slice(0, VISIBLE_COUNT);

  const handleMarkApproved = (emailId: string) => {
    setEmailStatuses(prev => ({ ...prev, [emailId]: "approved" }));
    toast({
      title: "Marked approved",
      description: "This draft is now ready to send.",
    });
  };

  const handleSendMail = async (emailId: string, supplier: string) => {
    setEmailStatuses(prev => ({ ...prev, [emailId]: "sent" }));

    try {
      await fetch("http://localhost:5001/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "info",
          title: "Email Sent",
          message: `Email to ${supplier} was delivered`,
          priority: "medium",
          requires_approval: false,
          agent_id: "Communicator",
          data: { email_id: emailId, supplier, action: "email_sent" },
        }),
      });
    } catch (error) {
      console.error("Notification error", error);
    }

    toast({
      title: "Send simulated",
      description: `Email to ${supplier} logged for follow-up.`,
    });
  };

  const handleCopy = (content: string, supplier: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Draft copied",
      description: `${supplier} email copied to your clipboard.`,
    });
  };

  const getStatusBadge = (status: "draft" | "approved" | "sent") => {
    if (status === "sent") return <Badge className="bg-emerald-500 text-emerald-50">Sent</Badge>;
    if (status === "approved") return <Badge className="bg-teal-500 text-teal-50">Approved</Badge>;
    return <Badge variant="outline">Draft</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200/70 bg-white/95 px-6 py-5 shadow-sm shadow-slate-900/5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Email drafts</h1>
            <p className="text-sm text-slate-500">Lightweight view of the Communicator agent's recommendations.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1"><Sparkles className="h-3.5 w-3.5 text-primary" /> {totals.total} drafts</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> {totals.approved} approved</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1"><Send className="h-3.5 w-3.5 text-emerald-500" /> {totals.sent} sent</span>
        </div>
      </div>

      {/* Email Drafts */}
      <div className="space-y-4">
        {displayedEmails.map(draft => {
          const status = emailStatuses[draft.id];
          const processedContent = appendSignatureIfMissing(draft.fullContent);

          return (
            <div key={draft.id} className="rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-[0_25px_40px_-35px_rgba(15,23,42,0.45)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                    <span>Supplier</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                    <span>{draft.supplier}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{draft.subject}</h2>
                  <p className="text-sm text-slate-500">{draft.summary}</p>
                </div>
                {getStatusBadge(status)}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {draft.highlight}
                </span>
                <p className="text-sm text-slate-500">{draft.insight}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View draft</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
                    <DialogHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <DialogTitle className="text-xl font-semibold text-slate-900">{draft.supplier}</DialogTitle>
                          <p className="text-sm text-slate-500">{draft.subject}</p>
                        </div>
                        <DialogClose className="rounded-full border border-slate-200/90 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
                          <X className="h-4 w-4" />
                        </DialogClose>
                      </div>
                    </DialogHeader>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{processedContent}</div>
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                      {status === "draft" && (
                        <Button size="sm" className="bg-teal-500 text-white hover:bg-teal-600" onClick={() => handleMarkApproved(draft.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="ml-2">Mark approved</span>
                        </Button>
                      )}
                      {status === "approved" && (
                        <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={() => handleSendMail(draft.id, draft.supplier)}>
                          <Send className="h-4 w-4" />
                          <span className="ml-2">Send mail</span>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleCopy(processedContent, draft.supplier)}>
                        <Copy className="h-4 w-4" />
                        <span className="ml-2">Copy text</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {status === "draft" && (
                  <Button size="sm" className="bg-teal-500 text-white hover:bg-teal-600" onClick={() => handleMarkApproved(draft.id)}>
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="ml-2">Approve</span>
                  </Button>
                )}

                {(status === "approved" || status === "sent") && (
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={() => handleSendMail(draft.id, draft.supplier)}>
                    <Send className="h-4 w-4" />
                    <span className="ml-2">Send</span>
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={() => handleCopy(processedContent, draft.supplier)}>
                  <Copy className="h-4 w-4" />
                  <span className="ml-2">Copy</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {mockEmails.length > VISIBLE_COUNT && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-200/80 bg-slate-50 px-5 py-3 text-sm text-slate-500">
          <span>
            Showing {displayedEmails.length} of {mockEmails.length} curated drafts
          </span>
          <Button size="sm" variant="ghost" onClick={() => setShowAllDrafts(prev => !prev)}>
            {showAllDrafts ? "Show fewer" : `Show ${mockEmails.length - VISIBLE_COUNT} more`}
          </Button>
        </div>
      )}

      <div className="rounded-3xl border border-dashed border-slate-200/80 bg-muted/40 px-6 py-4 text-sm text-slate-500">
        <p className="font-semibold text-slate-700">How this works</p>
        <p>
          Approving or sending from this demo triggers notifications only. In production, the Communicator agent would push approved drafts to your chosen email service (SendGrid, Mailgun, or SMTP).
        </p>
      </div>
    </div>
  );
}
