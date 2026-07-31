from app.utils.serializers import serialize_warning


class ProcessWarningUseCase:

    def __init__(
        self,
        warning_service,
        gis_service,
        recommendation_service,
        allocation_service,
        simulation_service,
    ):
        self.warning_service = warning_service
        self.gis_service = gis_service
        self.recommendation_service = recommendation_service
        self.allocation_service = allocation_service
        self.simulation_service = simulation_service

    def execute(
        self,
        db,
        warning_data,
    ):

        warning = self.warning_service.create_warning(
            db,
            warning_data,
        )

        impact = self.gis_service.analyse(
            db,
            warning,
        )

        recommendations = self.recommendation_service.generate(
            warning,
            impact,
        )

        allocations = self.allocation_service.allocate(
            warning,
            impact,
        )

        simulation = self.simulation_service.simulate(
            warning,
            impact,
        )

        return {
            "warning": serialize_warning(warning),
            "impact": impact,
            "recommendations": recommendations,
            "allocations": allocations,
            "simulation": simulation,
        }