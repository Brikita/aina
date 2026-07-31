class SimulationService:

    def simulate(self, exposure):

        affected = int(
            exposure.population * 0.30
        )

        return {

            "estimated_population": affected

        }