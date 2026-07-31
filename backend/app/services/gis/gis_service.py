from app.services.gis.impact_analysis import analyze_impact
from app.services.gis.exposure_service import analyze_exposure


class GISService:

    def analyse(
        self,
        db,
        warning,
    ):

        impact = analyze_impact(
            db,
            warning,
        )

        exposure = analyze_exposure(
            impact,
        )

        impact["exposure"] = exposure

        return impact


gis_service = GISService()