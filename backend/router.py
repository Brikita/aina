import os
import json
from typing import List, Optional, Dict
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from openai import OpenAI

from prompts import SYSTEM_PROMPT

router = APIRouter(prefix="/api", tags=["Decision Engine"])

# --- Request Models Aligned with GIS Specialist Payload ---

class ImpactData(BaseModel):
    total_assets: int = Field(..., description="Total count of assets in warning zone")
    asset_counts: Dict[str, int] = Field(
        default_factory=dict, 
        example={"HOSPITAL": 3, "SCHOOL": 57, "BRIDGE": 8}
    )

class ExposureData(BaseModel):
    exposure_score: int = Field(..., example=82, description="Calculated exposure score (0-100)")
    critical_assets: int = Field(..., example=68, description="Number of critical assets exposed")

class CriticalAssetItem(BaseModel):
    name: str = Field(..., example="Lodwar County Hospital")
    type: str = Field(..., example="HOSPITAL")

class GISDecisionRequest(BaseModel):
    warning_id: Optional[int] = Field(default=None, example=15)
    county: str = Field(..., example="Turkana")
    subcounty: str = Field(..., example="Loima")
    hazard: str = Field(..., example="Flood")
    severity: str = Field(..., example="High")
    impact: ImpactData
    exposure: ExposureData
    critical_assets: List[CriticalAssetItem] = []
    active_playbooks: Optional[List[str]] = Field(
        default=[], 
        example=["PB-FLOOD-EVACUATION-V1"]
    )

# --- Response Models ---

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
    summary="Generate Decision Intelligence from GIS Hazard Data"
)
async def generate_decision(payload: GISDecisionRequest):
    """
    Receives spatial warning, exposure score, and critical asset context from the GIS team,
    and returns ranked, explainable, facility-specific recommendations.
    """
    api_key = os.getenv("FEATHERLESS_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="FEATHERLESS_API_KEY environment variable is not set."
        )

    client = OpenAI(
        base_url="https://api.featherless.ai/v1", 
        api_key=api_key,
        timeout=180.0 # Standard timeout for Featherless model calls
    )

    # Format asset counts and key facilities into clean prompt strings
    asset_breakdown_str = ", ".join([f"{k}: {v}" for k, v in payload.impact.asset_counts.items()])
    named_facilities_str = "\n".join([f"- {asset.name} ({asset.type})" for asset in payload.critical_assets])

    user_prompt = f"""
    Analyze the following GIS warning context and generate target-actor recommendations:
    
    Warning ID: {payload.warning_id or 'N/A'}
    Location: {payload.subcounty} Subcounty, {payload.county} County
    Hazard Type: {payload.hazard}
    Severity: {payload.severity}
    
    Exposure & Impact Profile:
    - Overall Exposure Score: {payload.exposure.exposure_score}/100
    - Total Assets Exposed: {payload.impact.total_assets}
    - Critical Assets Exposed: {payload.exposure.critical_assets}
    - Asset Counts by Type: {asset_breakdown_str}
    
    High-Priority Named Facilities at Risk:
    {named_facilities_str if named_facilities_str else 'No specific facilities named.'}
    
    Active Operational Playbooks: {', '.join(payload.active_playbooks) if payload.active_playbooks else 'None'}
    """

    try:
        response = client.chat.completions.create(
            # Using deepseek v4 as configured on Featherless
            model="deepseek-ai/DeepSeek-V4-Pro", 
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2, 
        )

        content = response.choices[0].message.content
        
        # Clean potential markdown wrappers if model outputs ```json ... ```
        if content.startswith("```"):
            content = content.strip("`").replace("json\n", "").replace("json", "")
            
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