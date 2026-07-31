class AllocationService:

    def allocate(
        self,
        warning,
        recommendations,
    ):

        return {
            "status": "Allocation engine coming next",
            "warning_id": warning.id,
            "recommendations": recommendations,
        }


allocation_service = AllocationService()