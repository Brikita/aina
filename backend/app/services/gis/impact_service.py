from sqlalchemy.orm import Session

from app.models.impact_analysis import ImpactAnalysis
from app.models.warning import Warning

from app.services.gis.impact_analysis import (
    analyze_county_impact,
    analyze_subcounty_impact,
)


def create_impact_analysis(
    db: Session,
    warning: Warning,
):

    summary = analyze_county_impact(
        db=db,
        county=warning.county,
    )

    if warning.subcounty:
        subcounty_summary = analyze_subcounty_impact(
            db=db,
            subcounty=warning.subcounty,
        )
        summary.update(subcounty_summary)

    impact = ImpactAnalysis(
        warning_id=warning.id,
        summary=summary,
    )

    db.add(impact)
    db.commit()
    db.refresh(impact)

    return impact