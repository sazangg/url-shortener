from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default=..., alias="DATABASE_URL")
    REDIS_URL: str = Field(default=..., alias="REDIS_URL")
    JWT_SECRET: str = Field(default=..., alias="JWT_SECRET")
    JWT_ACCESS_EXP_MINUTES: int = Field(default=..., alias="JWT_ACCESS_EXP_MINUTES")
    JWT_REFRESH_EXP_DAYS: int = Field(default=..., alias="JWT_REFRESH_EXP_DAYS")
    BASE_URL: str = Field(default=..., alias="BASE_URL")

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

settings = Settings()
