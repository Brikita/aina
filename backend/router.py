import os
import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from openai import OpenAI

from prompts import SYSTEM_PROMPT

router = APIRouter(prefix="/api", tags=["Decision Engine"])

# --- Request / Response Models ---

class ContextData(BaseModel):
    ndvi_anomaly: Optional[float] = Field(default=None, description="NDVI anomaly deviation score e.g. -0.25")
    soil_moisture_index: Optional[float] = Field(default=None, description="Soil moisture index (0 to 1)")
    rainfall_deficit_pct: Optional[float] = Field(default=None, description="Forecasted rainfall deficit percentage")
    affected_population: Optional[int] = Field(default=None, description="Estimated population in risk zone")

class DecisionRequest(BaseModel):
    region_id: str = Field(..., example="KE-KAJ-01", description="Administrative unit ID")
    region_name: str = Field(..., example="Kajiado County", description="Human-readable region name")
    hazard_type: str = Field(..., example="drought", description="Hazard type (e.g., drought, flood)")
    risk_level: str = Field(..., example="high", description="Current classified risk level")
    context: ContextData
    active_playbooks: Optional[List[str]] = Field(default=[], description="List of pre-approved playbook IDs")

class RecommendationItem(BaseModel):
    id: str
    target_actor: str
    action_title: str
    action_details: str
    urgency: str
    confidence_score: float
    reasoning: str
    supporting_evidence: List[str]
    estimated_impact_if_delayed: str

class DecisionResponse(BaseModel):
    summary: str
    hazard_type: str
    classified_risk: str
    recommendations: List[RecommendationItem]


# --- API Endpoint ---

@router.post(
    "/generate-decision",
    response_model=DecisionResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate AI Decision Intelligence Recommendations"
)
async def generate_decision(payload: DecisionRequest):
    """
    Receives spatial and hazard context data, passes it to the AI Decision Engine,
    and returns ranked, explainable, actor-specific recommendations.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OPENAI_API_KEY environment variable is not set."
        )

    client = OpenAI(api_key=api_key)

    user_prompt = f"""
    Analyze the following decision context and generate recommendations:
    
    Region: {payload.region_name} (ID: {payload.region_id})
    Hazard Type: {payload.hazard_type}
    Current Classified Risk: {payload.risk_level}
    
    Context Data:
    - NDVI Anomaly: {payload.context.ndvi_anomaly}
    - Soil Moisture Index: {payload.context.soil_moisture_index}
    - Forecasted Rainfall Deficit: {payload.context.rainfall_deficit_pct}%
    - Affected Population: {payload.context.affected_population}
    
    Active Operational Playbooks: {', '.join(payload.active_playbooks) if payload.active_playbooks else 'None'}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2, # Low temperature for deterministic, consistent reasoning
        )

        content = response.choices[0].message.content
        parsed_json = json.loads(content)
        
        return parsed_json

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse structured JSON response from AI provider."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating decision: {str(e)}"
        )