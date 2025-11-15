# 🔔 SourceBot Notification System with Voice

A real-time notification system with ElevenLabs voice integration for manager alerts. Automatically converts business notifications (inventory, cashflow, purchases) into spoken audio.

## 📋 Features

✅ **Real-time Notifications** - Server-sent events (SSE) for instant updates  
✅ **Voice Notifications** - ElevenLabs text-to-speech for critical alerts  
✅ **Business Data Formatting** - Smart formatting for inventory, cashflow, purchases  
✅ **Approval Workflow** - Manager approval requests with voice  
✅ **Priority System** - Low, medium, high, critical with auto-voice for urgent  
✅ **Dashboard Interface** - Beautiful web UI for managers  
✅ **Voice Caching** - Generated audio stored in memory  

## 🚀 Quick Start

### 1. Configure Environment

Add to your `api.env` file:

```env
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb  # George voice
ELEVENLABS_MODEL=eleven_multilingual_v2

# Notification Settings
ENABLE_VOICE_NOTIFICATIONS=true
ENABLE_AUTO_APPROVAL=false
AGENT_PLATFORM_URL=http://localhost:8000
```

### 2. Start Notification Service

```powershell
python backend/notification_system.py
```

Service runs on **port 5001** (separate from main orchestrator on 5000)

### 3. Open Manager Dashboard

Open `notification_dashboard.html` in your browser to see real-time notifications with voice playback.

### 4. Test the System

```powershell
# Install requests if needed
pip install requests

# Run comprehensive test suite
python backend/test_notification_system.py
```

## 📖 Usage Examples

### Example 1: Inventory Alert with Voice

```python
from backend.notification_system import notify_business_update

notify_business_update(
    title="Inventory Low Stock Alert",
    message="Multiple items below reorder threshold",
    inventory={
        "current_stock": 45,
        "low_stock_items": ["USB-C Cables", "Power Banks", "HDMI Adapters"],
        "reorder_needed": True
    },
    priority="high",
    agent_id="InventoryAgent"
)
```

**Voice Output:** "Important notification. Inventory Low Stock Alert. Multiple items below reorder threshold. Current inventory is 45 units. Low stock alert for: USB-C Cables, Power Banks, HDMI Adapters. Reordering is required."

### Example 2: Cashflow Update

```python
notify_business_update(
    title="Weekly Cashflow Summary",
    message="Cashflow status requires attention",
    cashflow={
        "balance": 83000,
        "incoming": 45000,
        "outgoing": 62000,
        "status": "warning"
    },
    priority="high",
    agent_id="FinanceAgent"
)
```

**Voice Output:** "Important notification. Weekly Cashflow Summary. Cashflow status requires attention. Current cash flow balance is 83000 dollars. Incoming: 45000 dollars. Outgoing: 62000 dollars. Cash flow requires attention."

### Example 3: Purchase Recommendation

```python
notify_business_update(
    title="Purchase Approval Needed",
    message="Urgent purchase required to maintain inventory",
    purchase_recommendation={
        "items": [
            {"name": "Electronic Components", "quantity": 500},
            {"name": "USB Cables", "quantity": 200},
            {"name": "Power Adapters", "quantity": 100}
        ],
        "total_cost": 8500,
        "urgency": "critical"
    },
    inventory={
        "current_stock": 15,
        "low_stock_items": ["Electronic Components", "USB Cables"],
        "reorder_needed": True
    },
    priority="critical",
    agent_id="ProcurementAgent"
)
```

**Voice Output:** "Urgent notification. Purchase Approval Needed. Urgent purchase required to maintain inventory. You need to buy 3 items. Electronic Components, quantity 500. USB Cables, quantity 200. Power Adapters, quantity 100. Total estimated cost: 8500 dollars. Critical. Immediate purchase required. Current inventory is 15 units. Low stock alert for: Electronic Components, USB Cables. Reordering is required."

### Example 4: Approval Request

```python
from backend.notification_system import notify_approval_required

notify_approval_required(
    workflow_id="research_001",
    workflow_name="Electronics Supplier Research",
    findings={
        "supplier_count": 12,
        "summary": "Found 12 qualified suppliers with competitive pricing"
    },
    agent_id="ResearcherAgent"
)
```

**Voice Output:** "Important notification. Approval Required: Electronics Supplier Research. Research phase complete for 'Electronics Supplier Research'. Please review findings and approve to proceed with email drafting. Found 12 suppliers. Found 12 qualified suppliers with competitive pricing. Please review and provide approval."

## 🔌 API Endpoints

### Create Notification
```http
POST /api/notifications/create
Content-Type: application/json

{
    "type": "approval_request|workflow_update|error|info",
    "title": "Notification Title",
    "message": "Notification message",
    "priority": "low|medium|high|critical",
    "requires_approval": false,
    "generate_voice": true,
    "data": {
        "inventory": {...},
        "cashflow": {...},
        "purchase_recommendation": {...}
    },
    "agent_id": "AgentName"
}
```

### Get Voice Notification
```http
GET /api/notifications/{notification_id}/voice
```
Returns MP3 audio file

### Approve Notification
```http
POST /api/notifications/{notification_id}/approve
Content-Type: application/json

{
    "approved": true,
    "manager_id": "manager_name"
}
```

### Get Pending Approvals
```http
GET /api/notifications/pending
```

### Get Notification History
```http
GET /api/notifications/history?limit=50&type=approval_request
```

### Real-time Stream
```http
GET /api/notifications/stream
```
Server-sent events stream for real-time updates

### Health Check
```http
GET /api/notifications/health
```

## 🎯 Integration with Existing Agents

### Update Researcher Agent

Add notification when research completes:

```python
# In researcher.py
from backend.notification_system import notify_approval_required

def analyze_suppliers(plan, suppliers, api_key, model):
    # ... existing research code ...
    
    # After analysis, send notification
    notify_approval_required(
        workflow_id=workflow_state.get('workflow_id', 'unknown'),
        workflow_name=workflow_state.get('goal', 'Research'),
        findings=findings,
        agent_id="ResearcherAgent"
    )
    
    return findings
```

### Update Planner Agent

Add notification when planning starts:

```python
# In planner.py
from backend.notification_system import notify_workflow_update

def create_plan(goal, api_key, model):
    notify_workflow_update(
        workflow_id="plan_001",
        stage="planning",
        status="started",
        agent_id="PlannerAgent"
    )
    
    # ... existing planning code ...
```

### Add Business Metrics Agent

Create new agent for periodic updates:

```python
# In business_metrics_agent.py
from backend.notification_system import notify_business_update
import schedule
import time

def send_daily_metrics():
    # Fetch metrics from your systems
    inventory = get_inventory_status()
    cashflow = get_cashflow_data()
    
    notify_business_update(
        title="Daily Business Metrics",
        message="Your daily operational summary is ready",
        inventory=inventory,
        cashflow=cashflow,
        priority="medium",
        agent_id="MetricsAgent"
    )

# Schedule daily
schedule.every().day.at("09:00").do(send_daily_metrics)
```

## 🎨 Dashboard Features

The `notification_dashboard.html` provides:

- **Real-time Updates** - Auto-refreshes when new notifications arrive
- **Voice Playback** - Click to play voice notifications in browser
- **Approval Workflow** - Approve/reject directly from dashboard
- **Priority Colors** - Visual priority indicators (red=critical, orange=high, etc.)
- **Business Data Display** - Formatted inventory, cashflow, purchase data
- **Download Audio** - Download voice notifications as MP3
- **Connection Status** - Shows real-time connection status

## 🔧 Configuration Options

### Voice Generation Control

```python
# Force voice generation
notification = NotificationManager.create_notification(
    ...,
    generate_voice=True  # Always generate
)

# Disable voice
notification = NotificationManager.create_notification(
    ...,
    generate_voice=False  # Never generate
)

# Auto (default) - generates for high/critical priority
notification = NotificationManager.create_notification(
    ...,
    generate_voice=None  # Auto-decide based on priority
)
```

### Custom Voice Settings

Change voice in `api.env`:

```env
# Female voice (Rachel)
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# British male (George) - default
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb

# See ElevenLabs dashboard for more voice IDs
```

## 📊 Architecture

```
┌─────────────────────┐
│   Agent (Python)    │
│  - Planner          │
│  - Researcher       │
│  - Communicator     │
│  - Reporter         │
└──────────┬──────────┘
           │ notify_business_update()
           │ notify_approval_required()
           ▼
┌─────────────────────┐
│ Notification System │
│   (Port 5001)       │
│  - Flask Server     │
│  - ElevenLabs       │
│  - Voice Cache      │
└──────────┬──────────┘
           │
           ├─► SSE Stream ───────┐
           │                     │
           └─► Voice MP3         │
                                 ▼
                    ┌──────────────────────┐
                    │  Manager Dashboard   │
                    │  (notification_      │
                    │   dashboard.html)    │
                    │  - Real-time view    │
                    │  - Voice playback    │
                    │  - Approvals         │
                    └──────────────────────┘
```

## 🧪 Testing

### Manual Testing

1. Start notification service:
```powershell
python backend/notification_system.py
```

2. Open dashboard:
```powershell
start notification_dashboard.html
```

3. Send test notification:
```python
python backend/notification_examples.py
```

### Automated Testing

```powershell
python backend/test_notification_system.py
```

Tests include:
- ✅ Health check
- ✅ Basic notification creation
- ✅ Voice generation for inventory alerts
- ✅ Cashflow notifications
- ✅ Purchase recommendations
- ✅ Approval workflow
- ✅ Voice download

## 🐛 Troubleshooting

### Voice not generating

1. Check ElevenLabs API key in `api.env`
2. Verify `ENABLE_VOICE_NOTIFICATIONS=true`
3. Check console for error messages
4. Voice generation is async - wait 5-10 seconds

### Dashboard shows "Connection Error"

1. Ensure notification service is running on port 5001
2. Check CORS is enabled
3. Verify firewall allows localhost:5001

### "Cannot connect to notification service"

```powershell
# Check if service is running
netstat -ano | findstr :5001

# Start service
python backend/notification_system.py
```

### Voice quality issues

Adjust model in `api.env`:
```env
# Higher quality but slower
ELEVENLABS_MODEL=eleven_turbo_v2_5

# Multilingual support
ELEVENLABS_MODEL=eleven_multilingual_v2
```

## 📦 Dependencies

Add to `requirements.txt`:

```txt
flask>=3.0.0
flask-cors>=4.0.0
python-dotenv>=1.0.0
elevenlabs>=1.0.0
```

Install:
```powershell
pip install -r requirements.txt
```

## 🔒 Security Notes

- Run notification service on internal network only
- Use environment variables for API keys
- Implement authentication for production use
- Rate limit notification creation to prevent spam

## 🎉 Benefits

1. **Hands-free Notifications** - Managers can listen while multitasking
2. **Immediate Awareness** - Critical alerts spoken aloud
3. **Accessibility** - Audio for visually impaired managers
4. **Mobile Friendly** - Voice notifications work on mobile browsers
5. **Reduced Response Time** - Faster decision making with audio

## 📝 Example Workflow

```python
# 1. Agent detects low inventory
inventory_alert = notify_business_update(
    title="Critical Inventory Alert",
    message="Stock levels critically low",
    inventory={"current_stock": 10, "reorder_needed": True},
    priority="critical"
)

# 2. Manager hears voice notification: 
#    "Urgent notification. Critical Inventory Alert..."

# 3. Manager reviews in dashboard and approves purchase

# 4. System sends purchase recommendation
purchase_notif = notify_business_update(
    title="Purchase Order Created",
    message="Order #1234 created for restock",
    purchase_recommendation={
        "total_cost": 5000,
        "urgency": "high"
    },
    priority="high"
)

# 5. Manager receives confirmation via voice
```

## 🚀 Next Steps

1. Integrate with your existing agents (see examples above)
2. Customize voice messages in `VoiceNotificationGenerator`
3. Add more business data types (sales, performance, etc.)
4. Implement SMS/email fallback for critical notifications
5. Add multi-language support using ElevenLabs multilingual model

## 📞 Support

For issues or questions:
- Check logs in notification service console
- Review test examples in `backend/notification_examples.py`
- Run test suite: `python backend/test_notification_system.py`

---

**Built for SourceBot** 🤖 - Intelligent agent orchestration with voice-first manager communication
