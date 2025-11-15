"""
Example Integration: How to use Notification System with Voice in your agents
This shows how to integrate the notification system into existing SourceBot agents
"""

# ============ EXAMPLE 1: Import the notification helpers ============
from backend.notification_system import (
    notify_approval_required,
    notify_workflow_update,
    notify_error,
    notify_business_update,
    NotificationManager
)

# ============ EXAMPLE 2: Inventory Agent - Low Stock Alert ============
def inventory_agent_example():
    """
    Example: Inventory agent detects low stock and sends voice notification
    """
    # Simulate inventory check
    current_inventory = {
        "total_items": 150,
        "low_stock_items": ["USB-C Cables", "Power Banks", "HDMI Adapters"],
        "critical_items": ["USB-C Cables"],
        "reorder_threshold": 50
    }
    
    if current_inventory["total_items"] < 200:
        # Send voice notification to manager
        notification = notify_business_update(
            title="Inventory Low Stock Alert",
            message="Multiple items are below reorder threshold and require immediate attention",
            inventory={
                "current_stock": current_inventory["total_items"],
                "low_stock_items": current_inventory["low_stock_items"],
                "reorder_needed": True
            },
            priority="high",
            agent_id="InventoryAgent"
        )
        
        print(f"✓ Inventory alert sent: {notification['id']}")
        print(f"  Voice notification will be generated automatically")


# ============ EXAMPLE 3: Finance Agent - Cashflow Update ============
def finance_agent_example():
    """
    Example: Finance agent sends weekly cashflow update with voice
    """
    # Simulate cashflow calculation
    cashflow_data = {
        "opening_balance": 100000,
        "incoming": 45000,
        "outgoing": 62000,
        "closing_balance": 83000
    }
    
    # Determine status
    if cashflow_data["closing_balance"] < 90000:
        status = "warning"
        priority = "high"
    else:
        status = "healthy"
        priority = "medium"
    
    # Send notification
    notification = notify_business_update(
        title="Weekly Cashflow Summary",
        message=f"Cashflow status is {status}. Closing balance: ${cashflow_data['closing_balance']:,}",
        cashflow={
            "balance": cashflow_data["closing_balance"],
            "incoming": cashflow_data["incoming"],
            "outgoing": cashflow_data["outgoing"],
            "status": status
        },
        priority=priority,
        agent_id="FinanceAgent"
    )
    
    print(f"✓ Cashflow notification sent: {notification['id']}")


# ============ EXAMPLE 4: Procurement Agent - Purchase Recommendation ============
def procurement_agent_example():
    """
    Example: Procurement agent recommends purchases with voice notification
    """
    # Analyze inventory and recommend purchases
    recommended_purchases = [
        {"name": "USB-C Cables", "quantity": 500, "unit_cost": 5, "supplier": "TechSupply Co"},
        {"name": "Power Banks", "quantity": 200, "unit_cost": 15, "supplier": "PowerTech Ltd"},
        {"name": "HDMI Adapters", "quantity": 150, "unit_cost": 8, "supplier": "DisplayPro"}
    ]
    
    total_cost = sum(item["quantity"] * item["unit_cost"] for item in recommended_purchases)
    
    # Send notification with approval request
    notification = notify_business_update(
        title="Purchase Recommendation - Urgent",
        message=f"Recommended purchase order of ${total_cost:,} to restock critical items",
        purchase_recommendation={
            "items": [
                {"name": item["name"], "quantity": item["quantity"]}
                for item in recommended_purchases
            ],
            "total_cost": total_cost,
            "urgency": "high"
        },
        inventory={
            "current_stock": 45,
            "low_stock_items": [item["name"] for item in recommended_purchases],
            "reorder_needed": True
        },
        priority="critical",
        agent_id="ProcurementAgent"
    )
    
    print(f"✓ Purchase recommendation sent: {notification['id']}")
    print(f"  Total cost: ${total_cost:,}")


# ============ EXAMPLE 5: Research Agent - Integration with Approval ============
def researcher_agent_integration():
    """
    Example: How to integrate notification system into existing researcher agent
    Replaces manual approval with voice notification
    """
    # Simulate research completion
    research_findings = {
        "supplier_count": 12,
        "top_suppliers": [
            "TechSupply Co",
            "PowerTech Ltd", 
            "DisplayPro"
        ],
        "summary": "Found 12 qualified suppliers matching your criteria. Top 3 suppliers have excellent ratings and competitive pricing."
    }
    
    workflow_id = "research_20250115_001"
    
    # Send approval request with voice notification
    notification = notify_approval_required(
        workflow_id=workflow_id,
        workflow_name="Electronics Supplier Research",
        findings=research_findings,
        agent_id="ResearcherAgent"
    )
    
    print(f"✓ Approval request sent: {notification['id']}")
    print(f"  Manager will receive voice notification")
    print(f"  Awaiting approval to proceed with email drafting...")
    
    # Later, check if approved
    # approved = notification.get('approval', {}).get('approved', False)
    # if approved:
    #     proceed_with_email_drafting()


# ============ EXAMPLE 6: Complete Workflow Integration ============
def complete_workflow_example():
    """
    Example: Complete workflow with multiple notification points
    Shows how notifications work throughout the entire process
    """
    print("\n=== Complete Workflow with Voice Notifications ===\n")
    
    # Step 1: Workflow started
    notify_workflow_update(
        workflow_id="workflow_001",
        stage="initialization",
        status="started",
        agent_id="Orchestrator"
    )
    print("1. Workflow started notification sent")
    
    # Step 2: Planning complete
    notify_workflow_update(
        workflow_id="workflow_001",
        stage="planning",
        status="completed",
        agent_id="PlannerAgent"
    )
    print("2. Planning complete notification sent")
    
    # Step 3: Research findings ready (with voice)
    research_notification = notify_approval_required(
        workflow_id="workflow_001",
        workflow_name="Q1 Supplier Review",
        findings={
            "supplier_count": 15,
            "summary": "Identified 15 potential suppliers for partnership"
        },
        agent_id="ResearcherAgent"
    )
    print(f"3. Research approval request sent (ID: {research_notification['id'][:8]}...)")
    print("   → Voice notification generated for manager")
    
    # Step 4: Business metrics update
    notify_business_update(
        title="Supplier Analysis Complete",
        message="Cost analysis shows potential 15% savings with new suppliers",
        inventory={"current_stock": 180, "low_stock_items": [], "reorder_needed": False},
        cashflow={"balance": 125000, "incoming": 50000, "outgoing": 45000, "status": "healthy"},
        priority="medium",
        agent_id="AnalyticsAgent"
    )
    print("4. Business metrics update sent with voice")
    
    # Step 5: Final report
    notify_workflow_update(
        workflow_id="workflow_001",
        stage="reporting",
        status="completed",
        agent_id="ReporterAgent"
    )
    print("5. Final report notification sent")
    
    print("\n✓ Complete workflow notifications sent")
    print("  Manager receives voice notifications for critical steps")


# ============ EXAMPLE 7: Error Handling with Voice ============
def error_handling_example():
    """
    Example: How to send error notifications with voice for critical issues
    """
    try:
        # Simulate some operation that might fail
        result = perform_critical_operation()
    except Exception as e:
        # Send critical error notification with voice
        notify_error(
            error_message=f"Critical system error: {str(e)}",
            workflow_id="workflow_001",
            agent_id="SystemMonitor",
            critical=True  # This will trigger voice notification
        )
        print(f"✗ Critical error notification sent with voice")


def perform_critical_operation():
    """Dummy function for example"""
    raise Exception("Database connection lost")


# ============ EXAMPLE 8: Custom Notification with Specific Data ============
def custom_notification_example():
    """
    Example: Create custom notification with specific business data
    """
    # Create custom notification directly
    notification = NotificationManager.create_notification(
        notification_type="info",
        title="Daily Operations Summary",
        message="All systems operational. Daily metrics within expected ranges.",
        priority="low",
        agent_id="OperationsAgent",
        generate_voice=False,  # Don't generate voice for routine updates
        data={
            "operations": {
                "orders_processed": 145,
                "average_response_time": "2.3 seconds",
                "success_rate": 99.8
            }
        }
    )
    
    print(f"✓ Custom notification created: {notification['id']}")


# ============ RUNNING THE EXAMPLES ============
if __name__ == "__main__":
    print("=" * 70)
    print("NOTIFICATION SYSTEM INTEGRATION EXAMPLES")
    print("=" * 70)
    print("\nThese examples show how to integrate voice notifications into agents.")
    print("Make sure notification_system.py is running on port 5001!\n")
    
    try:
        # Run examples (comment out to avoid spamming)
        inventory_agent_example()
        print()
        
        finance_agent_example()
        print()
        
        procurement_agent_example()
        print()
        
        researcher_agent_integration()
        print()
        
        complete_workflow_example()
        print()
        
        # Error example (will fail intentionally)
        try:
            error_handling_example()
        except:
            pass
        print()
        
        custom_notification_example()
        print()
        
        print("\n" + "=" * 70)
        print("✓ All examples executed successfully")
        print("=" * 70)
        print("\nCheck the notification service logs to see notifications created.")
        print("Voice notifications are generated asynchronously in the background.")
        
    except Exception as e:
        print(f"\n✗ Error running examples: {e}")
        print("\nMake sure notification_system.py is running:")
        print("  python backend/notification_system.py")
