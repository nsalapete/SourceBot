"""Utility script to seed the notification service with sample events.

Usage:
    python backend/post_notifications.py

Environment variables:
    NOTIFICATION_SERVICE_URL  Base URL of notification service (default: http://127.0.0.1:5001)
"""
from __future__ import annotations

import os
import random
import time
from typing import Any, Dict, List

import requests

NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://127.0.0.1:5001")
CREATE_ENDPOINT = f"{NOTIFICATION_SERVICE_URL}/api/notifications/create"

NotificationPayload = Dict[str, Any]


def build_sample_notifications() -> List[NotificationPayload]:
    """Return a list of ready-to-send notification payloads."""
    return [
        {
            "type": "workflow_update",
            "title": "Research Complete",
            "message": "Supplier research finished and ready for review",
            "priority": "medium",
            "requires_approval": False,
            "agent_id": "Researcher",
            "data": {
                "workflow_id": "wf-001",
                "stage": "research",
                "status": "complete",
            },
        },
        {
            "type": "approval_request",
            "title": "Approval Needed: Draft Email",
            "message": "Approve the generated outreach email before sending",
            "priority": "high",
            "requires_approval": True,
            "agent_id": "Planner",
            "data": {
                "workflow_id": "wf-001",
                "findings": {
                    "summary": "Recommended contacting 3 suppliers",
                    "supplier_count": 3,
                },
            },
        },
        {
            "type": "info",
            "title": "Inventory Alert",
            "message": "Low stock detected on key SKUs",
            "priority": "high",
            "requires_approval": False,
            "agent_id": "BusinessAgent",
            "data": {
                "inventory": {
                    "current_stock": 42,
                    "low_stock_items": ["Sensor Pack", "Cooling Unit"],
                    "reorder_needed": True,
                },
                "cashflow": {
                    "balance": 18500,
                    "incoming": 9000,
                    "outgoing": 12000,
                    "status": "warning",
                },
            },
        },
        {
            "type": "error",
            "title": "Workflow Failure",
            "message": "Supplier API returned 500 during enrichment",
            "priority": "critical",
            "requires_approval": False,
            "agent_id": "System",
            "data": {
                "workflow_id": "wf-002",
                "is_critical": True,
            },
        },
    ]


def post_notification(payload: NotificationPayload) -> None:
    """Send a single notification payload to the service."""
    response = requests.post(CREATE_ENDPOINT, json=payload, timeout=30)
    response.raise_for_status()
    data = response.json()
    notification_id = data.get("notification", {}).get("id")
    print(f"✓ Created notification {notification_id or ''} ({payload['title']})")


def main() -> None:
    print(f"Posting notifications to {CREATE_ENDPOINT}")
    samples = build_sample_notifications()

    for payload in samples:
        try:
            post_notification(payload)
        except requests.RequestException as exc:
            print(f"✗ Failed to create notification '{payload['title']}': {exc}")
        time.sleep(random.uniform(0.5, 1.5))

    print("Done.")


if __name__ == "__main__":
    main()
