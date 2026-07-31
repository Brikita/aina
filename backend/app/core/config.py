from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Early Warning Decision Support API"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str

    ICPAC_API_URL: str = ""

    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()