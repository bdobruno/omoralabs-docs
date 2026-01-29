import importlib
import json
from pathlib import Path

from .data_loader import load_sample_data
from .methods import DBConnect
from .schema_manager import get_schemas


def running_workers(registry_data, db) -> None:
    workers = registry_data.get("workers", [])

    if not workers:
        print("✓ No workers found to run")
        return

    else:
        for worker_name in workers:
            worker_module = f"..workers.{worker_name}.orchestrator"
            orchestrator = importlib.import_module(worker_module, package=__package__)
            orchestrator.orchestrator(db)
        print("✓ Workers completed")


def get_registry_data() -> tuple[Path, dict]:
    # Load db_name from registry.json
    registry = Path(__file__).parent
    registry_file = registry / "registry.json"

    if not registry_file.exists():
        raise FileNotFoundError(f"registry.json not found at {registry_file}")

    with open(registry_file) as f:
        registry_data = json.load(f)
    return registry, registry_data


def setup_db(remote: bool = False):
    print("Initiating DB...")

    registry_path, registry_data = get_registry_data()

    db_name = registry_data.get("db_name")
    if not db_name:
        raise ValueError("db_name not found in registry.json")

    db = DBConnect(db_name, remote)

    print("Getting components...")

    print("Getting SQL schema...")
    schema = get_schemas(registry_path)
    print("✓ SQL Schema Package in hands")

    print("Implementing SQL schema...")
    db.implement_tables(schema)
    print("✓ SQL Schema Package implemented in DB")

    print("Loading data...")
    load_sample_data(db, registry_path)
    print("✓ Data loaded")

    print("Checking if workers needs running...")
    running_workers(registry_data, db)

    print("✓ Process completed")


def entry_setup_local_db():
    """Entry point for console script"""
    setup_db()


def entry_to_remote():
    """Entry point for console script"""
    setup_db(remote=True)
