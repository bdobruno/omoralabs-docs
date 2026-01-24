from pathlib import Path

from .utils import (
    get_json,
    get_registry_with_resolved_paths,
    resolve_dependency_order,
)


def _load_schema_data(schema_path, db_connection):
    """
    Load CSV data for a single schema.

    Args:
        schema_path: Path to schema JSON file
        db_connection: DBConnect instance with active connection
    """
    schema = get_json(schema_path)

    # Get CSV path (convention: table_name.csv, or explicit "data" field)
    csv_file = schema.get("data", f"{schema['table_name']}.csv")
    csv_path = Path(schema_path).parent / csv_file

    # Insert data
    db_connection.insert_csvs(str(csv_path), schema["table_name"])
    print(f"✓ Loaded data into {schema['table_name']} from {csv_file}")


def load_sample_data(db_connection, registry_path: Path):
    """
    Load sample CSV data into all tables defined in registry in dependency order.

    Args:
        db_connection: DBConnect instance with active connection
        registry_path: Path to the registry directory
    """
    registry = get_registry_with_resolved_paths(registry_path)

    # Load each section in order
    for section in ["semantic_layers", "facts"]:
        for schema_path in resolve_dependency_order(registry[section]):
            _load_schema_data(schema_path, db_connection)
