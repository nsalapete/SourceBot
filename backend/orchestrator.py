"""
Main Orchestration Engine - Manages the multi-agent workflow
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
from io import BytesIO

# Import agent modules
from planner import create_plan
from researcher import analyze_suppliers, load_suppliers_from_file
from communicator import draft_emails
from reporter import generate_status_report, generate_voice_report

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '..', 'api.env')
load_dotenv(env_path)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Global state variable to track workflow
workflow_state = {
    "goal": None,
    "status": "idle",  # idle, planning, researching, reviewing, drafting, completed
    "current_step": 0,
    "plan": [],
    "findings": None,
    "drafts": None,
    "suppliers_data": None
}

# Configuration
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
CLAUDE_MODEL = os.getenv('CLAUDE_MODEL', 'claude-sonnet-4-5-20250929')
INVENTORY_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'Retail', 'retail_inventory_snapshot_30_10_25_cleaned.csv')
SALES_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'Retail', 'retail_sales_data_01_09_2023_to_31_10_2025_cleaned.csv')


@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        "message": "SourceBot Multi-Agent Orchestrator",
        "version": "1.0",
        "endpoints": {
            "health": "/api/health",
            "submit_goal": "/api/submit-goal",
            "execute_research": "/api/execute-research",
            "approve_findings": "/api/approve-findings",
            "get_voice_report": "/api/get-voice-report",
            "get_text_report": "/api/get-text-report",
            "get_state": "/api/state",
            "reset": "/api/reset"
        }
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Orchestrator is running"})


@app.route('/api/submit-goal', methods=['POST'])
def submit_goal():
    """
    Step 1: Receive goal from frontend and initiate planning
    """
    global workflow_state
    
    data = request.json
    goal = data.get('goal')
    
    if not goal:
        return jsonify({"error": "Goal is required"}), 400
    
    # Reset state for new goal
    workflow_state = {
        "goal": goal,
        "status": "planning",
        "current_step": 0,
        "plan": [],
        "findings": None,
        "drafts": None,
        "suppliers_data": None
    }
    
    # Call Planner Agent
    plan_result = create_plan(goal, ANTHROPIC_API_KEY, CLAUDE_MODEL)
    
    if not plan_result.get('success'):
        workflow_state["status"] = "error"
        return jsonify({
            "error": "Failed to create plan",
            "details": plan_result.get('error')
        }), 500
    
    workflow_state["plan"] = plan_result["plan"]
    workflow_state["status"] = "planned"
    
    return jsonify({
        "message": "Goal submitted and plan created",
        "state": workflow_state
    })


@app.route('/api/execute-research', methods=['POST'])
def execute_research():
    """
    Step 2: Execute research phase (automatically after planning)
    """
    global workflow_state
    
    if workflow_state["status"] != "planned":
        return jsonify({"error": "Must complete planning first"}), 400
    
    workflow_state["status"] = "researching"
    workflow_state["current_step"] = 1
    
    # Load inventory and sales data
    data_result = load_suppliers_from_file(INVENTORY_FILE, SALES_FILE)
    
    if not data_result.get('success'):
        workflow_state["status"] = "error"
        return jsonify({
            "error": "Failed to load data",
            "details": data_result.get('error')
        }), 500
    
    workflow_state["suppliers_data"] = data_result["combined_data"]
    
    # Call Researcher Agent
    research_result = analyze_suppliers(
        workflow_state["goal"],
        workflow_state["suppliers_data"],
        ANTHROPIC_API_KEY,
        CLAUDE_MODEL
    )
    
    if not research_result.get('success'):
        workflow_state["status"] = "error"
        return jsonify({
            "error": "Failed to analyze suppliers",
            "details": research_result.get('error')
        }), 500
    
    workflow_state["findings"] = research_result["findings"]
    workflow_state["status"] = "awaiting_approval"
    workflow_state["current_step"] = 2
    
    return jsonify({
        "message": "Research completed",
        "state": workflow_state
    })


@app.route('/api/approve-findings', methods=['POST'])
def approve_findings():
    """
    Step 3: Human-in-the-loop approval of findings
    """
    global workflow_state
    
    if workflow_state["status"] != "awaiting_approval":
        return jsonify({"error": "No findings awaiting approval"}), 400
    
    data = request.json
    approved = data.get('approved', False)
    
    if not approved:
        workflow_state["status"] = "rejected"
        return jsonify({
            "message": "Findings rejected",
            "state": workflow_state
        })
    
    workflow_state["status"] = "drafting"
    workflow_state["current_step"] = 3
    
    # Call Communicator Agent
    relevant_suppliers = workflow_state["findings"].get("relevant_suppliers", [])
    
    draft_result = draft_emails(
        workflow_state["goal"],
        workflow_state["findings"],
        relevant_suppliers,
        ANTHROPIC_API_KEY,
        CLAUDE_MODEL
    )
    
    if not draft_result.get('success'):
        workflow_state["status"] = "error"
        return jsonify({
            "error": "Failed to draft emails",
            "details": draft_result.get('error')
        }), 500
    
    workflow_state["drafts"] = draft_result["drafts"]
    workflow_state["status"] = "completed"
    workflow_state["current_step"] = 4
    
    return jsonify({
        "message": "Emails drafted successfully",
        "state": workflow_state
    })


@app.route('/api/get-voice-report', methods=['GET'])
def get_voice_report():
    """
    Step 4: Generate voice report at any time
    """
    if workflow_state["status"] == "idle":
        return jsonify({"error": "No active workflow"}), 400
    
    # Generate text report
    report_result = generate_status_report(
        workflow_state,
        ANTHROPIC_API_KEY,
        CLAUDE_MODEL
    )
    
    if not report_result.get('success'):
        return jsonify({
            "error": "Failed to generate report",
            "details": report_result.get('error')
        }), 500
    
    report_text = report_result["report"]
    
    # Generate voice
    voice_result = generate_voice_report(report_text, ELEVENLABS_API_KEY)
    
    if not voice_result.get('success'):
        return jsonify({
            "error": "Failed to generate voice",
            "details": voice_result.get('error'),
            "text_report": report_text  # Return text as fallback
        }), 500
    
    # Return audio file
    audio_data = voice_result["audio_data"]
    return send_file(
        BytesIO(audio_data),
        mimetype='audio/mpeg',
        as_attachment=False,
        download_name='status_report.mp3'
    )


@app.route('/api/get-text-report', methods=['GET'])
def get_text_report():
    """
    Alternative: Get text-only status report
    """
    if workflow_state["status"] == "idle":
        return jsonify({"error": "No active workflow"}), 400
    
    report_result = generate_status_report(
        workflow_state,
        ANTHROPIC_API_KEY,
        CLAUDE_MODEL
    )
    
    if not report_result.get('success'):
        return jsonify({
            "error": "Failed to generate report",
            "details": report_result.get('error')
        }), 500
    
    return jsonify({
        "report": report_result["report"]
    })


@app.route('/api/state', methods=['GET'])
def get_state():
    """
    Get current workflow state
    """
    # Return state without full suppliers data (too large)
    state_copy = workflow_state.copy()
    if state_copy.get("suppliers_data"):
        state_copy["suppliers_count"] = len(state_copy["suppliers_data"])
        state_copy.pop("suppliers_data")
    
    return jsonify(state_copy)


@app.route('/api/reset', methods=['POST'])
def reset_workflow():
    """
    Reset the workflow to start fresh
    """
    global workflow_state
    workflow_state = {
        "goal": None,
        "status": "idle",
        "current_step": 0,
        "plan": [],
        "findings": None,
        "drafts": None,
        "suppliers_data": None
    }
    return jsonify({"message": "Workflow reset", "state": workflow_state})


if __name__ == '__main__':
    # Verify API keys are loaded
    if not ANTHROPIC_API_KEY:
        print("WARNING: ANTHROPIC_API_KEY not found in environment")
    if not ELEVENLABS_API_KEY:
        print("WARNING: ELEVENLABS_API_KEY not found in environment")
    
    print(f"Starting orchestrator on port 5000...")
    print(f"Using Claude model: {CLAUDE_MODEL}")
    print(f"Inventory file: {INVENTORY_FILE}")
    print(f"Sales file: {SALES_FILE}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
