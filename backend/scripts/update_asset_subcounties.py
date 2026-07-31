from sqlalchemy import text

from app.database.session import SessionLocal


def update_asset_subcounties():

    db = SessionLocal()

    try:

        db.execute(
            text(
                """
                UPDATE assets AS a
                SET subcounty = s.name
                FROM sub_counties AS s
                WHERE
                    ST_Within(
                        a.geometry,
                        s.geometry
                    );
                """
            )
        )

        db.commit()

        print("Finished assigning subcounties to assets.")

    except Exception as e:

        db.rollback()
        print(e)

    finally:

        db.close()


if __name__ == "__main__":
    update_asset_subcounties()