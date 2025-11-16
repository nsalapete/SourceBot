"""
Notification System - Manages real-time notifications and agent platform integration
Replaces manual approvals with immediate manager notifications
Includes ElevenLabs voice notification support
"""
from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import threading
import queue
import uuid
import io
from voice_utils import generate_voice, format_notification_text

# Load environment variables from root directory
import pathlib
root_dir = pathlib.Path(__file__).parent.parent
load_dotenv(root_dir / 'api.env')

app = Flask(__name__)
CORS(app)

# Voice settings
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
ELEVENLABS_VOICE_ID = os.getenv('ELEVENLABS_VOICE_ID', 'JBFqnCBsd6RMkjVDRZzb')

if ELEVENLABS_API_KEY:
    print(f"✓ ElevenLabs voice enabled: {ELEVENLABS_VOICE_ID}")
else:
    print("⚠ Warning: ELEVENLABS_API_KEY not found")

# Global notification state
notification_state = {
    "notifications": [],  # History of all notifications
    "pending": [],        # Notifications awaiting manager response
    "active_listeners": 0,  # Number of connected listeners
    "last_update": None,
    "voice_cache": {}     # Cache generated audio by notification ID
}

# Thread-safe queue for real-time notifications
notification_queue = queue.Queue()

# Configuration
AGENT_PLATFORM_URL = os.getenv('AGENT_PLATFORM_URL', 'http://localhost:8000')
ENABLE_AUTO_APPROVAL = os.getenv('ENABLE_AUTO_APPROVAL', 'false').lower() == 'true'
ENABLE_VOICE_NOTIFICATIONS = os.getenv('ENABLE_VOICE_NOTIFICATIONS', 'true').lower() == 'true'


# Voice generation now handled by voice_utils.py module


class NotificationManager:
    """Manages notification creation, distribution, and approval"""
    
    @staticmethod
    def create_notification(
        notification_type: str,
        title: str,
        message: str,
        priority: str = "medium",
        data: Optional[Dict[str, Any]] = None,
        requires_approval: bool = False,
        agent_id: Optional[str] = None,
        generate_voice: bool = None
    ) -> Dict[str, Any]:
        """
        Create and broadcast a notification
        
        Args:
            notification_type: 'approval_request', 'workflow_update', 'error', 'info'
            title: Notification title
            message: Notification message
            priority: 'low', 'medium', 'high', 'critical'
            data: Additional context data (inventory, cashflow, etc.)
            requires_approval: Whether this needs manager approval
            agent_id: ID of the agent sending notification
            generate_voice: Whether to generate voice notification (default: True for high/critical priority)
            
        Returns:
            Notification object with unique ID
        """
        notification_id = str(uuid.uuid4())
        
        # Decide if voice should be generated
        if generate_voice is None:
            generate_voice = ENABLE_VOICE_NOTIFICATIONS and (priority in ['high', 'critical'])
        
        notification = {
            "id": notification_id,
            "type": notification_type,
            "title": title,
            "message": message,
            "priority": priority,
            "requires_approval": requires_approval,
            "agent_id": agent_id,
            "data": data or {},
            "created_at": datetime.utcnow().isoformat(),
            "status": "pending" if requires_approval else "delivered",
            "approval": None,
            "manager_response_at": None,
            "has_voice": False,
            "voice_url": None
        }
        
        # Add to history
        notification_state["notifications"].append(notification)
        
        # Add to pending if requires approval
        if requires_approval:
            notification_state["pending"].append(notification_id)
        
        # Update timestamp
        notification_state["last_update"] = datetime.utcnow().isoformat()
        
        # Queue for real-time listeners
        notification_queue.put(notification)
        
        # Log notification
        print(f"[NOTIFICATION] {notification_type.upper()}: {title}")
        if requires_approval:
            print(f"  → Awaiting manager approval (ID: {notification_id})")
        
        # Generate voice notification asynchronously if enabled
        if generate_voice and ELEVENLABS_API_KEY:
            threading.Thread(
                target=NotificationManager._generate_voice_async,
                args=(notification_id, notification),
                daemon=True
            ).start()
        
        return notification
    
    @staticmethod
    def _generate_voice_async(notification_id: str, notification: Dict[str, Any]):
        """Generate voice notification in background thread"""
        try:
            # Use shared voice_utils module
            text = format_notification_text(notification)
            audio_bytes = generate_voice(
                text=text,
                api_key=ELEVENLABS_API_KEY,
                voice_id=ELEVENLABS_VOICE_ID
            )
            
            if audio_bytes:
                # Cache the audio
                notification_state["voice_cache"][notification_id] = audio_bytes
                
                # Update notification with voice info
                for notif in notification_state["notifications"]:
                    if notif["id"] == notification_id:
                        notif["has_voice"] = True
                        notif["voice_url"] = f"/api/notifications/{notification_id}/voice"
                        break
                
                # Notify listeners that voice is ready
                notification_queue.put({
                    "type": "voice_ready",
                    "notification_id": notification_id,
                    "voice_url": f"/api/notifications/{notification_id}/voice"
                })
                
                print(f"✓ Voice notification ready: {notification_id[:8]}")
        
        except Exception as e:
            print(f"✗ Voice generation failed for {notification_id}: {e}")
    
    @staticmethod
    def approve_notification(notification_id: str, approved: bool, manager_id: str = "manager") -> Dict[str, Any]:
        """
        Manager approves or rejects a notification
        
        Args:
            notification_id: ID of notification to approve
            approved: True to approve, False to reject
            manager_id: ID of manager providing approval
            
        Returns:
            Updated notification object
        """
        # Find notification
        notification = None
        for notif in notification_state["notifications"]:
            if notif["id"] == notification_id:
                notification = notif
                break
        
        if not notification:
            return {"error": f"Notification {notification_id} not found"}
        
        if not notification["requires_approval"]:
            return {"error": "This notification does not require approval"}
        
        # Update notification
        notification["approval"] = {
            "approved": approved,
            "manager_id": manager_id,
            "response_at": datetime.utcnow().isoformat()
        }
        notification["status"] = "approved" if approved else "rejected"
        notification["manager_response_at"] = datetime.utcnow().isoformat()
        
        # Remove from pending
        if notification_id in notification_state["pending"]:
            notification_state["pending"].remove(notification_id)
        
        # Update state
        notification_state["last_update"] = datetime.utcnow().isoformat()
        
        # Notify listeners
        notification_queue.put({
            "type": "approval_response",
            "notification_id": notification_id,
            "approved": approved,
            "manager_id": manager_id
        })
        
        action = "✓ Approved" if approved else "✗ Rejected"
        print(f"[APPROVAL] {action} - {notification_id}")
        
        return notification
    
    @staticmethod
    def get_notification(notification_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific notification by ID"""
        for notif in notification_state["notifications"]:
            if notif["id"] == notification_id:
                return notif
        return None
    
    @staticmethod
    def get_pending_approvals() -> List[Dict[str, Any]]:
        """Get all notifications awaiting approval"""
        pending = []
        for notif_id in notification_state["pending"]:
            notif = NotificationManager.get_notification(notif_id)
            if notif:
                pending.append(notif)
        return pending
    
    @staticmethod
    def auto_approve_if_enabled(notification_id: str) -> bool:
        """Automatically approve if feature is enabled"""
        if ENABLE_AUTO_APPROVAL:
            NotificationManager.approve_notification(notification_id, True, "auto_approval_system")
            return True
        return False


# ============ API ENDPOINTS ============

@app.route('/api/notifications/health', methods=['GET'])
def health_check():
    """Health check for notification service"""
    return jsonify({
        "status": "healthy",
        "message": "Notification service is running",
        "active_listeners": notification_state["active_listeners"],
        "pending_count": len(notification_state["pending"]),
        "voice_enabled": ENABLE_VOICE_NOTIFICATIONS and ELEVENLABS_API_KEY is not None,
        "cached_voices": len(notification_state["voice_cache"])
    })


@app.route('/api/notifications/create', methods=['POST'])
def create_notification_endpoint():
    """
    Create and broadcast a notification
    
    Expected JSON body:
    {
        "type": "approval_request|workflow_update|error|info",
        "title": "Notification title",
        "message": "Notification message",
        "priority": "low|medium|high|critical",
        "requires_approval": true/false,
        "generate_voice": true/false,  // optional
        "data": {  // optional - business-specific data
            "inventory": {...},
            "cashflow": {...},
            "purchase_recommendation": {...}
        },
        "agent_id": "agent_name"  // optional
    }
    """
    data = request.json
    
    # Validate required fields
    required_fields = ['type', 'title', 'message']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Create notification
    notification = NotificationManager.create_notification(
        notification_type=data.get('type'),
        title=data.get('title'),
        message=data.get('message'),
        priority=data.get('priority', 'medium'),
        data=data.get('data'),
        requires_approval=data.get('requires_approval', False),
        agent_id=data.get('agent_id'),
        generate_voice=data.get('generate_voice')
    )
    
    return jsonify({
        "message": "Notification created",
        "notification": notification
    })


@app.route('/api/notifications/<notification_id>/voice', methods=['GET'])
def get_voice_notification(notification_id):
    """Get voice version of notification as MP3"""
    # Check cache
    if notification_id not in notification_state["voice_cache"]:
        return jsonify({"error": "Voice notification not available"}), 404
    
    audio_bytes = notification_state["voice_cache"][notification_id]
    
    # Return as MP3 file
    return send_file(
        io.BytesIO(audio_bytes),
        mimetype='audio/mpeg',
        as_attachment=False,
        download_name=f'notification_{notification_id[:8]}.mp3'
    )


@app.route('/api/notifications/<notification_id>/approve', methods=['POST'])
def approve_notification_endpoint(notification_id):
    """
    Manager approves a notification
    
    Expected JSON body:
    {
        "approved": true/false,
        "manager_id": "manager_name"  // optional
    }
    """
    data = request.json or {}
    approved = data.get('approved', False)
    manager_id = data.get('manager_id', 'manager')
    
    result = NotificationManager.approve_notification(notification_id, approved, manager_id)
    
    if "error" in result:
        return jsonify(result), 400
    
    return jsonify({
        "message": "Approval recorded",
        "notification": result
    })


@app.route('/api/notifications/pending', methods=['GET'])
def get_pending_notifications():
    """Get all notifications awaiting manager approval"""
    pending = NotificationManager.get_pending_approvals()
    
    return jsonify({
        "count": len(pending),
        "pending": pending
    })


@app.route('/api/notifications/<notification_id>', methods=['GET'])
def get_notification_endpoint(notification_id):
    """Get a specific notification by ID"""
    notification = NotificationManager.get_notification(notification_id)
    
    if not notification:
        return jsonify({"error": "Notification not found"}), 404
    
    return jsonify(notification)


@app.route('/api/notifications/history', methods=['GET'])
def get_notification_history():
    """Get notification history with optional filtering"""
    limit = request.args.get('limit', 50, type=int)
    notification_type = request.args.get('type')
    
    history = notification_state["notifications"]
    
    # Filter by type if provided
    if notification_type:
        history = [n for n in history if n['type'] == notification_type]
    
    # Return most recent first, limited
    history = sorted(history, key=lambda x: x['created_at'], reverse=True)[:limit]
    
    return jsonify({
        "count": len(history),
        "history": history
    })


@app.route('/api/notifications/state', methods=['GET'])
def get_notification_state():
    """Get current notification service state"""
    return jsonify({
        "total_notifications": len(notification_state["notifications"]),
        "pending_count": len(notification_state["pending"]),
        "active_listeners": notification_state["active_listeners"],
        "auto_approval_enabled": ENABLE_AUTO_APPROVAL,
        "voice_enabled": ENABLE_VOICE_NOTIFICATIONS,
        "cached_voices": len(notification_state["voice_cache"]),
        "last_update": notification_state["last_update"]
    })


@app.route('/api/notifications/clear', methods=['POST'])
def clear_notifications():
    """Clear notification history (for testing/reset)"""
    global notification_state
    
    count = len(notification_state["notifications"])
    notification_state = {
        "notifications": [],
        "pending": [],
        "active_listeners": 0,
        "last_update": None,
        "voice_cache": {}
    }
    
    # Clear the queue
    try:
        while True:
            notification_queue.get_nowait()
    except queue.Empty:
        pass
    
    return jsonify({
        "message": f"Cleared {count} notifications",
        "state": notification_state
    })


# ============ SERVER EVENTS / STREAMING ============

@app.route('/api/notifications/stream', methods=['GET'])
def notification_stream():
    """
    Server-sent events stream for real-time notifications
    Clients connect here to receive live updates
    """
    def event_generator():
        """Generate notification events as they arrive"""
        # Increment listener count
        notification_state["active_listeners"] += 1
        
        try:
            yield f"data: {json.dumps({'type': 'connected', 'message': 'Connected to notification stream'})}\n\n"
            
            # Stream notifications from queue
            while True:
                try:
                    # Wait for notification (timeout after 30 seconds)
                    notification = notification_queue.get(timeout=30)
                    yield f"data: {json.dumps(notification)}\n\n"
                except queue.Empty:
                    # Send keepalive
                    yield f"data: {json.dumps({'type': 'keepalive'})}\n\n"
        finally:
            # Decrement listener count
            notification_state["active_listeners"] -= 1
    
    return Response(
        event_generator(),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive'
        }
    )


# ============ AGENT INTEGRATION HELPERS ============

def notify_approval_required(
    workflow_id: str,
    workflow_name: str,
    findings: Dict[str, Any],
    agent_id: str = "Researcher"
) -> Dict[str, Any]:
    """
    Helper function for agents to request manager approval
    Called when research is complete and needs approval before drafting
    """
    message = f"Research phase complete for '{workflow_name}'. Please review findings and approve to proceed with email drafting."
    
    return NotificationManager.create_notification(
        notification_type="approval_request",
        title=f"Approval Required: {workflow_name}",
        message=message,
        priority="high",
        requires_approval=True,
        agent_id=agent_id,
        data={
            "workflow_id": workflow_id,
            "workflow_name": workflow_name,
            "findings": findings
        },
        generate_voice=True
    )


def notify_workflow_update(
    workflow_id: str,
    stage: str,
    status: str,
    agent_id: str = "Orchestrator"
) -> Dict[str, Any]:
    """Helper function to notify about workflow progress"""
    return NotificationManager.create_notification(
        notification_type="workflow_update",
        title=f"Workflow Update: {stage}",
        message=f"Workflow '{workflow_id}' is now {status}",
        priority="medium",
        requires_approval=False,
        agent_id=agent_id,
        data={
            "workflow_id": workflow_id,
            "stage": stage,
            "status": status
        }
    )


def notify_error(
    error_message: str,
    workflow_id: str = None,
    agent_id: str = "System",
    critical: bool = False
) -> Dict[str, Any]:
    """Helper function to notify about errors"""
    return NotificationManager.create_notification(
        notification_type="error",
        title="Error Occurred",
        message=error_message,
        priority="critical" if critical else "high",
        requires_approval=False,
        agent_id=agent_id,
        data={
            "workflow_id": workflow_id,
            "is_critical": critical
        },
        generate_voice=critical
    )


def notify_business_update(
    title: str,
    message: str,
    inventory: Optional[Dict[str, Any]] = None,
    cashflow: Optional[Dict[str, Any]] = None,
    purchase_recommendation: Optional[Dict[str, Any]] = None,
    priority: str = "high",
    agent_id: str = "BusinessAgent"
) -> Dict[str, Any]:
    """
    Helper function for business-related notifications with voice support
    Automatically generates voice for inventory, cashflow, and purchase updates
    
    Example usage:
        notify_business_update(
            title="Inventory Alert",
            message="Low stock detected",
            inventory={
                "current_stock": 50,
                "low_stock_items": ["Item A", "Item B"],
                "reorder_needed": True
            },
            cashflow={
                "balance": 15000,
                "incoming": 5000,
                "outgoing": 8000,
                "status": "warning"
            },
            purchase_recommendation={
                "items": [
                    {"name": "Item A", "quantity": 100},
                    {"name": "Item B", "quantity": 50}
                ],
                "total_cost": 3500,
                "urgency": "high"
            }
        )
    """
    data = {}
    
    if inventory:
        data["inventory"] = inventory
    if cashflow:
        data["cashflow"] = cashflow
    if purchase_recommendation:
        data["purchase_recommendation"] = purchase_recommendation
    
    return NotificationManager.create_notification(
        notification_type="info",
        title=title,
        message=message,
        priority=priority,
        requires_approval=False,
        agent_id=agent_id,
        data=data,
        generate_voice=True  # Always generate voice for business updates
    )


# ============ EXPORT FOR USE IN OTHER MODULES ============

__all__ = [
    'NotificationManager',
    'VoiceNotificationGenerator',
    'notify_approval_required',
    'notify_workflow_update',
    'notify_error',
    'notify_business_update'
]


if __name__ == '__main__':
    print(f"Starting Notification Service on port 5001...")
    print(f"Auto-approval enabled: {ENABLE_AUTO_APPROVAL}")
    print(f"Voice notifications enabled: {ENABLE_VOICE_NOTIFICATIONS}")
    print(f"Agent Platform URL: {AGENT_PLATFORM_URL}")
    
    if ELEVENLABS_API_KEY:
        print(f"✓ ElevenLabs voice: {ELEVENLABS_VOICE_ID}")
    
    print("\nNotification service is ready to receive events from agents")
    print("Managers can connect to /api/notifications/stream for real-time updates")
    print("Voice notifications available at /api/notifications/<id>/voice")
    
    # Use threaded mode for better SSE support, disable debug reloader
    app.run(debug=False, host='0.0.0.0', port=5001, threaded=True)
