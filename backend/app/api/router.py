from fastapi import APIRouter

from app.api.routes import test_db
from app.api.routes import warnings
from app.api.routes import gis
from app.api.routes import hazards
from app.api.routes import assets
from app.api.routes import dashboard
from app.api.routes import allocation
from app.api.routes import recommendation
from app.api.routes import impact
from app.api.routes import exposure
from app.api.routes import simulation
from app.api.routes import counties
from app.api.routes import subcounties



router = APIRouter()

router.include_router(test_db.router)
router.include_router(warnings.router)
# router.include_router(gis.router)
# router.include_router(hazards.router)
router.include_router(assets.router)
router.include_router(dashboard.router)
router.include_router(allocation.router)
router.include_router(recommendation.router)
router.include_router(impact.router)
router.include_router(exposure.router)
router.include_router(simulation.router)
router.include_router(counties.router)
router.include_router(subcounties.router)