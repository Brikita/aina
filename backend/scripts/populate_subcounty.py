from app.database.session import SessionLocal
from app.models.warning import Warning
from app.models.subcounty import SubCounty

db = SessionLocal()

warnings = db.query(Warning).all()

for warning in warnings:

    subcounty = (
        db.query(SubCounty)
        .filter(
            SubCounty.name == warning.subcounty
        )
        .first()
    )

    if subcounty:
        warning.subcounty_id = subcounty.id

db.commit()

print("Done.")