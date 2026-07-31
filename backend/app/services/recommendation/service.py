from .engine import RecommendationEngine


class RecommendationService:

    def __init__(self):

        self.engine = RecommendationEngine()

    def generate(self, gis_result):

        return self.engine.generate(
            gis_result["risk_score"]
        )