from pathlib import Path

from .data_loader import load_sample_data
from .methods import DBConnect
from .schema_manager import get_schemas


def main(db_name: str):
    print("Initiating DB...")
    db = DBConnect(db_name)

    print("Getting components...")
    registry = Path(__file__).parent

    print("Getting SQL schema...")
    schema = get_schemas(registry)
    print("✓ SQL Schema Package in hands")

    print("Implementing SQL schema...")
    db.implement_tables(schema)
    print("✓ SQL Schema Package implemented in DB")

    print("Loading sample data...")
    load_sample_data(db, registry)
    print("✓ Process completed")


def cli():
    """Entry point for console script"""
    db_name = ""
    main(db_name)
