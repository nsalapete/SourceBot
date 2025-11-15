import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Search, Mail, FileText, ArrowRight, Sparkles, Zap, Target, LineChart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Sarah brings over 15 years of experience in supply chain management and enterprise software. Before founding SourceBot, she led procurement transformation initiatives at Fortune 500 companies. Her vision is to democratize access to AI-powered sourcing tools for businesses of all sizes."
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Michael is a seasoned AI engineer with a passion for multi-agent systems. He previously worked at leading AI research labs and has published numerous papers on autonomous agent collaboration. He architected the core AI infrastructure powering SourceBot's intelligent agents."
    },
    {
      name: "Emily Thompson",
      role: "Head of AI Research",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Emily holds a PhD in Machine Learning from MIT and specializes in natural language processing and agent coordination. She leads our research team in developing cutting-edge algorithms that make our AI agents more intelligent and efficient with every iteration."
    },
    {
      name: "David Park",
      role: "VP of Product",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "David has spent the last decade building enterprise SaaS products that solve real business problems. His deep understanding of procurement workflows ensures SourceBot delivers tangible value to procurement teams while maintaining an intuitive user experience."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Procurement</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Let multi-agent AI handle your{" "}
              <span className="text-primary">sourcing pipeline</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              SourceBot automates supplier research, outreach drafting, and status reporting 
              with intelligent agents working in harmony.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 shadow-glow" onClick={() => navigate("/app")}>
                Open Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/app/help")}>
                View Demo Flow
              </Button>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-32 bottom-0 z-10" />
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop" alt="Dashboard preview" className="rounded-lg shadow-2xl border w-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Multi-Agent Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Five specialized AI agents collaborate to streamline your procurement process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[{
            icon: LineChart,
            title: "Analyst Agent",
            description: "Analyzes procurement needs, identifies risks, and provides strategic insights to managers.",
            color: "text-warning"
          }, {
            icon: Target,
            title: "Planner Agent",
            description: "Breaks down sourcing goals into actionable steps and coordinates the workflow.",
            color: "text-primary"
          }, {
            icon: Search,
            title: "Researcher Agent",
            description: "Scans CRM data and external sources to find the best matching suppliers.",
            color: "text-electric"
          }, {
            icon: Mail,
            title: "Communicator Agent",
            description: "Drafts personalized outreach emails tailored to each supplier.",
            color: "text-accent"
          }, {
            icon: FileText,
            title: "Reporter Agent",
            description: "Generates status summaries and voice memos to keep you informed.",
            color: "text-orange"
          }].map((feature, index) => <Card key={index} className="gradient-card border-border/50 hover:shadow-lg transition-smooth hover:scale-105">
                <CardContent className="pt-6">
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to transform your sourcing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[{
            step: "01",
            title: "Analyze procurement needs",
            description: "Analyst agent reviews requirements, identifies risks, and provides strategic insights."
          }, {
            step: "02",
            title: "Set a sourcing goal",
            description: "Enter your procurement requirements and let the Planner agent create a strategy."
          }, {
            step: "03",
            title: "Let agents research & draft",
            description: "Researcher finds suppliers, Communicator drafts outreach—all automatically."
          }, {
            step: "04",
            title: "Approve & send outreach",
            description: "Review recommendations and emails, then approve to initiate contact."
          }].map((step, index) => <div key={index} className="relative animate-slide-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <span className="text-2xl font-bold text-primary">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < 3 && <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/30" />}
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-4xl">
          <Card className="gradient-primary text-primary-foreground border-0 shadow-glow">
            <CardContent className="p-12 text-center">
              <Bot className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Try the live multi-agent dashboard
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Experience the power of AI-driven procurement in our interactive demo
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => navigate("/app")}>
                Launch Dashboard
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experts in AI and procurement automation working to revolutionize sourcing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-lg transition-smooth cursor-pointer"
                onClick={() => setSelectedMember(index)}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={selectedMember !== null} onOpenChange={() => setSelectedMember(null)}>
            <DialogContent className="max-w-2xl">
              {selectedMember !== null && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={teamMembers[selectedMember].image} 
                        alt={teamMembers[selectedMember].name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <DialogTitle className="text-2xl">{teamMembers[selectedMember].name}</DialogTitle>
                        <DialogDescription className="text-base">{teamMembers[selectedMember].role}</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="mt-4">
                    <p className="text-muted-foreground leading-relaxed">{teamMembers[selectedMember].bio}</p>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your procurement needs..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>;
}