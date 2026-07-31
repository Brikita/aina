class RecommendationService:

    def generate(
        self,
        warning,
        impact,
    ):

        return {
            "status": "Recommendation engine coming next",
            "warning_id": warning.id,
            "impact": impact,
        }


recommendation_service = RecommendationService()