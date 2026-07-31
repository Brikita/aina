from app.models.asset import AssetType


def analyze_exposure(
    impact: dict,
) -> dict:
    """
    Converts impact analysis into exposure metrics.
    """

    asset_counts = impact["summary"]["asset_counts"]

    hospitals = asset_counts.get(
        AssetType.HOSPITAL.name,
        0,
    )

    schools = asset_counts.get(
        AssetType.SCHOOL.name,
        0,
    )

    shelters = asset_counts.get(
        AssetType.SHELTER.name,
        0,
    )

    bridges = asset_counts.get(
        AssetType.BRIDGE.name,
        0,
    )

    critical_assets = impact["critical_assets"]

    exposure_score = (
        hospitals * 5
        + schools * 2
        + shelters * 4
        + bridges * 3
    )

    if exposure_score >= 1000:
        exposure_level = "Extreme"

    elif exposure_score >= 500:
        exposure_level = "High"

    elif exposure_score >= 200:
        exposure_level = "Moderate"

    else:
        exposure_level = "Low"

    return {

        "county": impact["county"],

        "subcounty": impact.get("subcounty"),

        "hazard": impact["hazard"],

        "severity": impact["severity"],

        "counts": {

            "hospitals": hospitals,

            "schools": schools,

            "shelters": shelters,

            "bridges": bridges,

            "critical_assets": len(
                critical_assets,
            ),

        },

        "critical_assets": critical_assets,

        "exposure_score": exposure_score,

        "exposure_level": exposure_level,

    }