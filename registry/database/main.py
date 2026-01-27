import json
from pathlib import Path

from .data_loader import load_sample_data
from .methods import DBConnect
from .schema_manager import get_schemas


def setup_db(remote: bool = False):
    print("Initiating DB...")

    # Load db_name from registry.json
    registry = Path(__file__).parent
    registry_file = registry / "registry.json"

    if not registry_file.exists():
        raise FileNotFoundError(f"registry.json not found at {registry_file}")

    with open(registry_file) as f:
        registry_data = json.load(f)

    db_name = registry_data.get("db_name")
    if not db_name:
        raise ValueError("db_name not found in registry.json")

    db = DBConnect(db_name, remote)

    print("Getting components...")

    print("Getting SQL schema...")
    schema = get_schemas(registry)
    print("✓ SQL Schema Package in hands")

    print("Implementing SQL schema...")
    db.implement_tables(schema)
    print("✓ SQL Schema Package implemented in DB")

    print("Loading sample data...")
    load_sample_data(db, registry)
    print("✓ Process completed")


def entry_setup_local_db():
    """Entry point for console script"""
    setup_db()


def entry_to_remote():
    """Entry point for console script"""
    setup_db(remote=True)
