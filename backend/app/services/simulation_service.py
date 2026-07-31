class SimulationService:

    def simulate(
        self,
        warning,
        impact,
    ):

        return {
            "status": "Simulation coming next",
            "warning_id": warning.id,
            "impact": impact,
        }


simulation_service = SimulationService()