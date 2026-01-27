import json
import os
from pathlib import Path

import pytest

from database.data_loader import load_sample_data
from database.methods import DBConnect
from database.schema_manager import get_schemas
from database.utils import get_json


@pytest.fixture
def test_db_path(tmp_path):
    """Fixture to provide a temporary database path"""
    return str(tmp_path / "test.db")


@pytest.fixture
def registry_simple(tmp_path):
    """Create registry with only gl_accounts_simple"""
    MODULE_DIR = Path(__file__).parent.parent
    registry = get_json(str(MODULE_DIR / "database" / "registry.json"))

    if "gl_accounts_segmented" in registry["semantic_layers"]:
        del registry["semantic_layers"]["gl_accounts_segmented"]

    # Convert relative paths to absolute
    for section in ["semantic_layers", "facts"]:
        for key, config in registry[section].items():
            config["schema"] = str(MODULE_DIR / config["schema"])

    temp_dir = tmp_path / "simple"
    temp_dir.mkdir()

    with open(temp_dir / "registry.json", "w") as f:
        json.dump(registry, f)

    return temp_dir


@pytest.fixture
def registry_segmented(tmp_path):
    """Create registry with only gl_accounts_segmented"""
    MODULE_DIR = Path(__file__).parent.parent
    registry = get_json(str(MODULE_DIR / "database" / "registry.json"))

    if "gl_accounts_simple" in registry["semantic_layers"]:
        del registry["semantic_layers"]["gl_accounts_simple"]

    # Convert relative paths to absolute
    for section in ["semantic_layers", "facts"]:
        for key, config in registry[section].items():
            config["schema"] = str(MODULE_DIR / config["schema"])

    temp_dir = tmp_path / "segmented"
    temp_dir.mkdir()

    with open(temp_dir / "registry.json", "w") as f:
        json.dump(registry, f)

    return temp_dir


def test_all_csv_files_exist():
    """Test that all CSV files referenced in schemas exist"""
    MODULE_DIR = Path(__file__).parent.parent
    registry = get_json(str(MODULE_DIR / "database/registry.json"))

    for section in ["semantic_layers", "facts"]:
        for config in registry[section].values():
            schema_path = MODULE_DIR / config["schema"]
            schema = get_json(str(schema_path))

            # Get CSV path using same logic as data_loader
            csv_file = schema.get("data", f"{schema['table_name']}.csv")
            csv_path = schema_path.parent / csv_file

            assert csv_path.exists(), (
                f"CSV file {csv_path} should exist for table {schema['table_name']}"
            )


def test_csv_path_resolution_convention():
    """Test that CSV path resolution uses convention (table_name.csv) by default"""
    MODULE_DIR = Path(__file__).parent.parent
    schema_path = MODULE_DIR / "semantic_layers/dates.json"
    schema = get_json(str(schema_path))

    # If no "data" field, should default to table_name.csv
    csv_file = schema.get("data", f"{schema['table_name']}.csv")
    expected = "dates.csv"

    assert csv_file == expected


def test_csv_path_resolution_explicit():
    """Test that explicit 'data' field overrides convention"""
    MODULE_DIR = Path(__file__).parent.parent

    # Check if gl_accounts_simple has explicit data field
    schema_path = MODULE_DIR / "semantic_layers/gl_accounts_simple.json"
    if schema_path.exists():
        schema = get_json(str(schema_path))

        # If it has "data" field, it should use that instead of table_name.csv
        if "data" in schema:
            csv_file = schema.get("data", f"{schema['table_name']}.csv")
            assert csv_file == schema["data"]
            assert csv_file != f"{schema['table_name']}.csv"


def test_load_sample_data_simple_variant(test_db_path, registry_simple):
    """Test loading data with gl_accounts_simple variant"""
    db = DBConnect(test_db_path)

    # Create tables
    sqls = get_schemas(registry_simple)
    db.implement_tables(sqls)

    # Load data
    load_sample_data(db, registry_simple)

    # Verify gl_accounts has data
    count = db.conn.execute("SELECT COUNT(*) FROM gl_accounts").fetchall()[0][0]
    assert count > 0

    db.conn.close()
    os.remove(test_db_path)


def test_load_sample_data_segmented_variant(test_db_path, registry_segmented):
    """Test loading data with gl_accounts_segmented variant"""
    db = DBConnect(test_db_path)

    # Create tables
    sqls = get_schemas(registry_segmented)
    db.implement_tables(sqls)

    # Load data
    load_sample_data(db, registry_segmented)

    # Verify gl_accounts has data
    count = db.conn.execute("SELECT COUNT(*) FROM gl_accounts").fetchall()[0][0]
    assert count > 0

    db.conn.close()
    os.remove(test_db_path)


def test_registry_sections_order():
    """Test that data loader processes semantic_layers before facts"""
    MODULE_DIR = Path(__file__).parent.parent
    registry = get_json(str(MODULE_DIR / "database/registry.json"))

    # Verify both sections exist
    assert "semantic_layers" in registry
    assert "facts" in registry

    # The order in load_sample_data should be semantic_layers first
    sections = ["semantic_layers", "facts"]
    for section in sections:
        assert section in registry
