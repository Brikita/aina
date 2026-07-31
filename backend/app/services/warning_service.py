from sqlalchemy.orm import Session

from app.repositories.warning_repository import warning_repository


class WarningService:

    def create_warning(
        self,
        db: Session,
        warning,
    ):
        return warning_repository.create(db, warning)

    def get_warnings(
        self,
        db: Session,
    ):
        return warning_repository.get_all(db)

    def get_warning(
        self,
        db: Session,
        warning_id: int,
    ):
        return warning_repository.get_by_id(
            db,
            warning_id,
        )


warning_service = WarningService()