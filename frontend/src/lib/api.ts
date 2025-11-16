// Mock API layer for SourceBot
// In production, these will be replaced with actual Flask backend endpoints

export interface Task {
  id: string;
  goal: string;
  createdAt: string;
  status: 'planning' | 'researching' | 'awaiting_approval' | 'completed';
  steps: Step[];
  suppliers: Supplier[];
  emails: EmailDraft[];
  logs: ActivityLog[];
}

export interface Step {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  agent: 'analyst' | 'planner' | 'researcher' | 'communicator' | 'reporter';
}

export interface Supplier {
  id: string;
  Product: string;
  Packsize: string;
  Headoffice_ID: string;
  Barcode: string;
  OrderList: string;
  Case_Size: string;
  Trade_Price: number;
  RRP: number;
  Dept_Fullname: string;
  Group_Fullname: string;
  Branch_Name: string;
  Branch_Stock_Level: number;
  approved?: boolean;
}

export interface EmailDraft {
  id: string;
  supplierId: string;
  supplierName: string;
  subject: string;
  body: string;
  status: 'draft' | 'approved' | 'sent';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  agent: 'analyst' | 'planner' | 'researcher' | 'communicator' | 'reporter' | 'manager';
  action: string;
  details: string;
}

export interface VoiceReport {
  summary: string;
  audioUrl: string;
}

// Simulated delay for realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
let currentTask: Task | null = null;
let taskHistory: Task[] = [];

// Mock supplier database (simulating CRM data)
const mockSuppliers: Supplier[] = [
  {
    id: 's1',
    name: 'TechParts Global',
    category: 'Electronics',
    country: 'China',
    rating: 4.8,
    moq: '5,000 units',
    leadTime: '45 days',
    matchScore: 95,
    email: 'contact@techparts.com',
    description: 'Leading electronics component manufacturer with 20+ years experience',
    capabilities: ['PCB Assembly', 'Component Sourcing', 'Quality Control'],
    approved: false,
  },
  {
    id: 's2',
    name: 'Euro Manufacturing Co',
    category: 'Electronics',
    country: 'Germany',
    rating: 4.6,
    moq: '10,000 units',
    leadTime: '60 days',
    matchScore: 88,
    email: 'sales@euromanuf.de',
    description: 'Premium European manufacturer with ISO certifications',
    capabilities: ['Custom Manufacturing', 'R&D Support', 'Prototyping'],
    approved: false,
  },
  {
    id: 's3',
    name: 'Asia Components Ltd',
    category: 'Electronics',
    country: 'Taiwan',
    rating: 4.7,
    moq: '3,000 units',
    leadTime: '30 days',
    matchScore: 92,
    email: 'info@asiacomp.tw',
    description: 'Fast turnaround specialist for electronics components',
    capabilities: ['Fast Delivery', 'Flexible MOQ', 'Technical Support'],
    approved: false,
  },
  {
    id: 's4',
    name: 'Global Tech Suppliers',
    category: 'Electronics',
    country: 'South Korea',
    rating: 4.9,
    moq: '8,000 units',
    leadTime: '50 days',
    matchScore: 90,
    email: 'contact@globaltech.kr',
    description: 'High-quality electronics supplier with global reach',
    capabilities: ['Quality Assurance', 'Global Logistics', 'Custom Solutions'],
    approved: false,
  },
  {
    id: 's5',
    name: 'PrimeParts Inc',
    category: 'Electronics',
    country: 'USA',
    rating: 4.5,
    moq: '15,000 units',
    leadTime: '40 days',
    matchScore: 85,
    email: 'sales@primeparts.com',
    description: 'US-based supplier with strong domestic presence',
    capabilities: ['Local Support', 'Compliance', 'Rapid Response'],
    approved: false,
  },
];

/**
 * Start a new procurement task
 * Backend endpoint: POST /api/start
 */
export async function startTask(goal: string, priority: string = 'medium', category: string = 'Electronics'): Promise<Task> {
  await delay(1500);

  const taskId = `task-${Date.now()}`;
  
  const steps: Step[] = [
    {
      id: 'step-0',
      name: 'Analyze Procurement Needs',
      description: 'Review requirements, identify risks, and provide strategic insights',
      status: 'done',
      agent: 'analyst',
    },
    {
      id: 'step-1',
      name: 'Create Action Plan',
      description: 'Break down sourcing goal into actionable requirements',
      status: 'done',
      agent: 'planner',
    },
    {
      id: 'step-2',
      name: 'Identify Suppliers',
      description: 'Search CRM and external databases for potential suppliers',
      status: 'in_progress',
      agent: 'researcher',
    },
    {
      id: 'step-3',
      name: 'Draft Outreach',
      description: 'Prepare personalized emails for top suppliers',
      status: 'pending',
      agent: 'communicator',
    },
    {
      id: 'step-4',
      name: 'Await Approval',
      description: 'Manager reviews and approves supplier list and emails',
      status: 'pending',
      agent: 'planner',
    },
  ];

  const logs: ActivityLog[] = [
    {
      id: 'log-0',
      timestamp: new Date(Date.now() - 4000).toISOString(),
      agent: 'analyst',
      action: 'Needs Analysis',
      details: 'Analyzed procurement requirements and market conditions',
    },
    {
      id: 'log-0b',
      timestamp: new Date(Date.now() - 3500).toISOString(),
      agent: 'analyst',
      action: 'Insights Generated',
      details: 'Identified key risks and recommended mitigation strategies',
    },
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 2500).toISOString(),
      agent: 'planner',
      action: 'Task Created',
      details: `Created new procurement task: "${goal}"`,
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 2000).toISOString(),
      agent: 'planner',
      action: 'Plan Generated',
      details: 'Generated 5-step procurement plan',
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 1000).toISOString(),
      agent: 'researcher',
      action: 'Started Research',
      details: 'Scanning CRM database for matching suppliers',
    },
  ];

  currentTask = {
    id: taskId,
    goal,
    createdAt: new Date().toISOString(),
    status: 'researching',
    steps,
    suppliers: [],
    emails: [],
    logs,
  };

  taskHistory.push(currentTask);
  
  return currentTask;
}

/**
 * Get current status of a task
 * Backend endpoint: GET /api/status/:taskId
 */
export async function getStatus(taskId: string): Promise<Task> {
  await delay(800);

  if (!currentTask || currentTask.id !== taskId) {
    throw new Error('Task not found');
  }

  // Simulate progress: add suppliers if not already added
  if (currentTask.suppliers.length === 0) {
    const topSuppliers = mockSuppliers.slice(0, 5).map(s => ({ ...s }));
    currentTask.suppliers = topSuppliers;
    
    currentTask.logs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agent: 'researcher',
      action: 'Suppliers Found',
      details: `Identified ${topSuppliers.length} potential suppliers with high match scores`,
    });

    currentTask.steps[2].status = 'done';
  }

  return { ...currentTask };
}

/**
 * Approve selected suppliers
 * Backend endpoint: POST /api/approve-suppliers
 */
export async function approveSuppliers(taskId: string, supplierIds: string[]): Promise<Task> {
  await delay(1000);

  if (!currentTask || currentTask.id !== taskId) {
    throw new Error('Task not found');
  }

  // Mark suppliers as approved
  currentTask.suppliers = currentTask.suppliers.map(s => ({
    ...s,
    approved: supplierIds.includes(s.id),
  }));

  // Generate email drafts for approved suppliers
  const approvedSuppliers = currentTask.suppliers.filter(s => s.approved);
  currentTask.emails = approvedSuppliers.map(supplier => ({
    id: `email-${supplier.id}`,
    supplierId: supplier.id,
    supplierName: supplier.name,
    subject: `Partnership Inquiry - ${currentTask!.goal.substring(0, 50)}`,
    body: `Dear ${supplier.name} Team,\n\nWe are reaching out regarding a procurement opportunity that aligns with your capabilities.\n\nProject: ${currentTask!.goal}\n\nKey Requirements:\n- Quantity: As specified in our goal\n- Timeline: Urgent\n- Quality: High standards required\n\nWe noticed your strong track record in ${supplier.category} and would like to discuss how we might work together.\n\nCould you please provide:\n1. Current pricing and MOQ\n2. Lead time estimates\n3. Quality certifications\n\nLooking forward to your response.\n\nBest regards,\nSourceBot Procurement Team`,
    status: 'draft',
  }));

  currentTask.logs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    agent: 'manager',
    action: 'Suppliers Approved',
    details: `Approved ${supplierIds.length} suppliers for outreach`,
  });

  currentTask.logs.push({
    id: `log-${Date.now() + 1}`,
    timestamp: new Date().toISOString(),
    agent: 'communicator',
    action: 'Emails Drafted',
    details: `Generated ${currentTask.emails.length} personalized outreach emails`,
  });

  currentTask.steps[2].status = 'done';
  currentTask.steps[3].status = 'in_progress';
  currentTask.status = 'awaiting_approval';

  return { ...currentTask };
}

/**
 * Get all suppliers from CRM database
 * Backend endpoint: GET /api/suppliers
 */
export async function getAllSuppliers(): Promise<Supplier[]> {
  try {
    const response = await fetch('http://localhost:5000/api/suppliers');
    if (!response.ok) {
      throw new Error(`Failed to fetch suppliers: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching suppliers from backend:', error);
    // Fallback to mock data if backend is unavailable
    await delay(500);
    return mockSuppliers.map(s => ({ ...s }));
  }
}

/**
 * Get voice report for a task
 * Backend endpoint: GET /api/report/:taskId
 */
export async function getVoiceReport(taskId: string): Promise<VoiceReport> {
  await delay(2000);

  if (!currentTask || currentTask.id !== taskId) {
    throw new Error('Task not found');
  }

  const approvedCount = currentTask.suppliers.filter(s => s.approved).length;
  const summary = `Status update for procurement task: ${currentTask.goal}. Current status: ${currentTask.status}. We have identified ${currentTask.suppliers.length} potential suppliers with an average match score of ${Math.round(currentTask.suppliers.reduce((acc, s) => acc + s.matchScore, 0) / currentTask.suppliers.length)}%. ${approvedCount > 0 ? `${approvedCount} suppliers have been approved and outreach emails have been drafted.` : 'Awaiting supplier approval.'} The multi-agent team has completed ${currentTask.steps.filter(s => s.status === 'done').length} of ${currentTask.steps.length} planned steps.`;

  currentTask.logs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    agent: 'reporter',
    action: 'Voice Report Generated',
    details: 'Generated status summary and prepared voice memo',
  });

  return {
    summary,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
  };
}

/**
 * Get task history
 * Backend endpoint: GET /api/tasks
 */
export async function getTaskHistory(): Promise<Task[]> {
  await delay(300);
  return taskHistory.map(t => ({ ...t }));
}

/**
 * Mark email as approved
 * Backend endpoint: POST /api/approve-email
 */
export async function approveEmail(taskId: string, emailId: string): Promise<void> {
  await delay(500);

  if (!currentTask || currentTask.id !== taskId) {
    throw new Error('Task not found');
  }

  currentTask.emails = currentTask.emails.map(e =>
    e.id === emailId ? { ...e, status: 'approved' as const } : e
  );

  currentTask.logs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    agent: 'manager',
    action: 'Email Approved',
    details: `Approved email for sending`,
  });
}
