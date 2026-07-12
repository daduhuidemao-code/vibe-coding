import os
import yaml
from dotenv import load_dotenv
from typing import Dict, List, Optional

load_dotenv()

CONFIG_PATH = os.getenv("CONFIG_PATH", "../config")


def load_yaml_config(filename: str) -> Dict:
    config_path = os.path.join(CONFIG_PATH, filename)
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Config file not found: {config_path}")
    
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_feeds_config() -> Dict:
    return load_yaml_config("feeds.yaml")


def get_app_config() -> Dict:
    return load_yaml_config("config.yaml")


def get_groups() -> List[Dict]:
    feeds_config = get_feeds_config()
    return feeds_config.get("groups", [])


def get_subscriptions() -> List[Dict]:
    feeds_config = get_feeds_config()
    return feeds_config.get("subscriptions", [])


def get_database_url() -> str:
    app_config = get_app_config()
    return app_config.get("database", {}).get("url", "postgresql://rss_user:rss_password@db:5432/rss_db")


def get_cors_origins() -> List[str]:
    app_config = get_app_config()
    return app_config.get("app", {}).get("cors_origins", ["http://localhost:3000"])


def get_email_config() -> Dict:
    app_config = get_app_config()
    return app_config.get("notification", {}).get("email", {})


def get_webhook_config() -> Dict:
    app_config = get_app_config()
    return app_config.get("notification", {}).get("webhook", {})


def get_summary_config() -> Dict:
    app_config = get_app_config()
    return app_config.get("summary", {"enabled": True, "max_length": 200})