from sqlalchemy import func

from app.models.warning import Warning
from app.models.asset import Asset


def get_dashboard_summary(db):

    active_warnings = (
        db.query(Warning)
        .filter(Warning.status == "ACTIVE")
        .count()
    )

    critical_assets = (
        db.query(Asset).count()
    )

    return {

        "active_warnings": active_warnings,

        "high_risk_counties": active_warnings,

        "resources_available": 162,

        "critical_assets": critical_assets,
    }