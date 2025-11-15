"""
Test script for Notification System with Voice Support
Tests various notification types and voice generation
"""
import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:5001"

def test_health():
    """Test notification service health"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/api/notifications/health")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_basic_notification():
    """Test basic notification without voice"""
    print("\n=== Testing Basic Notification ===")
    notification = {
        "type": "info",
        "title": "Test Notification",
        "message": "This is a simple test notification",
        "priority": "medium",
        "agent_id": "TestAgent",
        "generate_voice": False
    }
    
    response = requests.post(
        f"{BASE_URL}/api/notifications/create",
        json=notification
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Created notification ID: {result['notification']['id']}")
    return result['notification']

def test_inventory_notification():
    """Test inventory alert with voice"""
    print("\n=== Testing Inventory Notification with Voice ===")
    notification = {
        "type": "info",
        "title": "Inventory Alert",
        "message": "Low stock detected in warehouse",
        "priority": "high",
        "agent_id": "InventoryAgent",
        "generate_voice": True,
        "data": {
            "inventory": {
                "current_stock": 45,
                "low_stock_items": ["Electronics Components", "Office Supplies", "Safety Equipment"],
                "reorder_needed": True
            }
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/notifications/create",
        json=notification
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    notif_id = result['notification']['id']
    print(f"Created notification ID: {notif_id}")
    print("Voice generation started in background...")
    
    # Wait for voice to be generated
    print("Waiting for voice generation (5 seconds)...")
    time.sleep(5)
    
    # Check if voice is ready
    notif_response = requests.get(f"{BASE_URL}/api/notifications/{notif_id}")
    notif = notif_response.json()
    if notif.get('has_voice'):
        print(f"✓ Voice notification ready at: {notif['voice_url']}")
        print(f"  You can download it: {BASE_URL}{notif['voice_url']}")
    else:
        print("⚠ Voice not ready yet")
    
    return result['notification']

def test_cashflow_notification():
    """Test cashflow notification with voice"""
    print("\n=== Testing Cashflow Notification with Voice ===")
    notification = {
        "type": "info",
        "title": "Cashflow Update",
        "message": "Weekly cashflow summary requires your attention",
        "priority": "high",
        "agent_id": "FinanceAgent",
        "generate_voice": True,
        "data": {
            "cashflow": {
                "balance": 125000,
                "incoming": 45000,
                "outgoing": 62000,
                "status": "warning"
            }
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/notifications/create",
        json=notification
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    notif_id = result['notification']['id']
    print(f"Created notification ID: {notif_id}")
    
    return result['notification']

def test_purchase_recommendation():
    """Test purchase recommendation with voice"""
    print("\n=== Testing Purchase Recommendation with Voice ===")
    notification = {
        "type": "approval_request",
        "title": "Purchase Approval Needed",
        "message": "Urgent purchase required to maintain inventory levels",
        "priority": "critical",
        "requires_approval": True,
        "agent_id": "ProcurementAgent",
        "generate_voice": True,
        "data": {
            "purchase_recommendation": {
                "items": [
                    {"name": "Electronic Components Pack", "quantity": 500},
                    {"name": "USB Cables Bulk", "quantity": 200},
                    {"name": "Power Adapters", "quantity": 100}
                ],
                "total_cost": 8500,
                "urgency": "critical"
            },
            "inventory": {
                "current_stock": 15,
                "low_stock_items": ["Electronic Components", "USB Cables"],
                "reorder_needed": True
            }
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/notifications/create",
        json=notification
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    notif_id = result['notification']['id']
    print(f"Created notification ID: {notif_id}")
    print("This requires approval!")
    
    return result['notification']

def test_approval_workflow(notification_id):
    """Test approving a notification"""
    print(f"\n=== Testing Approval Workflow ===")
    print(f"Approving notification: {notification_id}")
    
    approval = {
        "approved": True,
        "manager_id": "test_manager"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/notifications/{notification_id}/approve",
        json=approval
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Approval status: {result['notification']['status']}")
    return result['notification']

def test_pending_notifications():
    """Get pending notifications"""
    print("\n=== Testing Pending Notifications ===")
    response = requests.get(f"{BASE_URL}/api/notifications/pending")
    result = response.json()
    print(f"Pending count: {result['count']}")
    for notif in result['pending']:
        print(f"  - {notif['title']} (ID: {notif['id'][:8]}...)")
    return result

def test_notification_history():
    """Get notification history"""
    print("\n=== Testing Notification History ===")
    response = requests.get(f"{BASE_URL}/api/notifications/history?limit=10")
    result = response.json()
    print(f"Total notifications: {result['count']}")
    for notif in result['history']:
        voice_indicator = "🔊" if notif.get('has_voice') else ""
        print(f"  {voice_indicator} [{notif['priority']}] {notif['title']} - {notif['type']}")
    return result

def test_comprehensive_business_notification():
    """Test comprehensive business notification with all data"""
    print("\n=== Testing Comprehensive Business Notification ===")
    notification = {
        "type": "info",
        "title": "Weekly Business Summary",
        "message": "Complete business status update for your review",
        "priority": "high",
        "agent_id": "BusinessIntelligenceAgent",
        "generate_voice": True,
        "data": {
            "inventory": {
                "current_stock": 320,
                "low_stock_items": ["Item A", "Item B", "Item C"],
                "reorder_needed": True
            },
            "cashflow": {
                "balance": 87500,
                "incoming": 35000,
                "outgoing": 42000,
                "status": "healthy"
            },
            "purchase_recommendation": {
                "items": [
                    {"name": "Raw Materials", "quantity": 1000},
                    {"name": "Packaging Supplies", "quantity": 500}
                ],
                "total_cost": 15000,
                "urgency": "medium"
            }
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/notifications/create",
        json=notification
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    notif_id = result['notification']['id']
    print(f"Created comprehensive notification ID: {notif_id}")
    
    return result['notification']

def download_voice(notification_id, filename="test_notification.mp3"):
    """Download voice notification"""
    print(f"\n=== Downloading Voice Notification ===")
    try:
        response = requests.get(f"{BASE_URL}/api/notifications/{notification_id}/voice")
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"✓ Voice downloaded: {filename} ({len(response.content)} bytes)")
            return True
        else:
            print(f"✗ Voice not available: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error downloading voice: {e}")
        return False

def run_all_tests():
    """Run complete test suite"""
    print("=" * 60)
    print("NOTIFICATION SYSTEM - COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    
    try:
        # Health check
        health = test_health()
        
        if not health.get('voice_enabled'):
            print("\n⚠ WARNING: Voice notifications are disabled!")
            print("   Set ENABLE_VOICE_NOTIFICATIONS=true in api.env")
        
        # Basic notification
        basic = test_basic_notification()
        
        # Business notifications with voice
        inventory = test_inventory_notification()
        cashflow = test_cashflow_notification()
        purchase = test_purchase_recommendation()
        comprehensive = test_comprehensive_business_notification()
        
        # Wait for all voice generations
        print("\n⏳ Waiting for voice generation to complete (10 seconds)...")
        time.sleep(10)
        
        # Check history
        history = test_notification_history()
        
        # Check pending
        pending = test_pending_notifications()
        
        # Approve the purchase recommendation if it exists
        if purchase and purchase.get('requires_approval'):
            approved = test_approval_workflow(purchase['id'])
        
        # Try to download a voice notification
        voice_notifications = [n for n in history['history'] if n.get('has_voice')]
        if voice_notifications:
            print(f"\n✓ Found {len(voice_notifications)} voice notifications")
            first_voice = voice_notifications[0]
            download_voice(first_voice['id'], f"test_voice_{first_voice['id'][:8]}.mp3")
        else:
            print("\n⚠ No voice notifications available to download")
        
        print("\n" + "=" * 60)
        print("TEST SUITE COMPLETE")
        print("=" * 60)
        print(f"✓ Total notifications created: {len(history['history'])}")
        print(f"✓ Voice notifications: {len(voice_notifications)}")
        print(f"✓ Pending approvals: {len(pending['pending'])}")
        
    except requests.exceptions.ConnectionError:
        print("\n✗ ERROR: Cannot connect to notification service")
        print("   Make sure the service is running: python backend/notification_system.py")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_all_tests()
