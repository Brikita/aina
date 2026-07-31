from .rules import RULES


class RecommendationEngine:

    def generate(self, risk_score):

        recommendations = []

        for rule in RULES:

            if risk_score >= rule["min_score"]:

                recommendations.append(rule)

        return recommendations