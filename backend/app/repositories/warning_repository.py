from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.county import County
from app.models.subcounty import SubCounty
from app.models.warning import Warning
from app.schemas.warning import WarningCreate
from app.utils.serializers import serialize_warning


class WarningRepository:

    def create(
        self,
        db: Session,
        warning: WarningCreate,
    ) -> Warning:

        subcounty = (
            db.query(SubCounty)
            .join(County)
            .filter(
                SubCounty.name.ilike(warning.subcounty),
                County.name.ilike(warning.county),
            )
            .first()
        )

        if subcounty is None:
            raise HTTPException(
                status_code=404,
                detail=f"Subcounty '{warning.subcounty}' was not found in county '{warning.county}'.",
            )

        db_warning = Warning(
            county=warning.county,
            subcounty=warning.subcounty,
            subcounty_id=subcounty.id,
            hazard=warning.hazard,
            severity=warning.severity,

            # copy geometry from subcounty
            geometry=subcounty.geometry,
        )

        db.add(db_warning)
        db.commit()
        db.refresh(db_warning)

        return db_warning

    def get_all(self, db: Session):
        warnings = db.query(Warning).all()

        result = [
            serialize_warning(warning)
            for warning in warnings
        ]

        return result

    def get_by_id(
        self,
        db: Session,
        warning_id: int,
    ):
        return (
            db.query(Warning)
            .filter(Warning.id == warning_id)
            .first()
        )


warning_repository = WarningRepository()