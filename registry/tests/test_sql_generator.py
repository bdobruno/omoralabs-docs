from pathlib import Path

from database.utils import get_json, json_to_sql


def test_registry_exists():
    """Test that registry.json file exists"""
    registry_path = Path(__file__).parent.parent / "database/registry.json"
    assert registry_path.exists(), "registry.json should exist"


def test_registry_structure():
    """Test that registry.json has correct structure"""
    registry_path = Path(__file__).parent.parent / "database/registry.json"
    registry = get_json(str(registry_path))

    assert "semantic_layers" in registry, "registry should have semantic_layers"
    assert "facts" in registry, "registry should have facts"
    assert isinstance(registry["semantic_layers"], dict)
    assert isinstance(registry["facts"], dict)


def test_all_schema_files_exist():
    """Test that all schema files referenced in registry exist"""
    MODULE_DIR = Path(__file__).parent.parent
    registry = get_json(str(MODULE_DIR / "database/registry.json"))

    for section in ["semantic_layers", "facts"]:
        for name, config in registry[section].items():
            schema_path = MODULE_DIR / config["schema"]
            assert schema_path.exists(), (
                f"Schema file {config['schema']} should exist for {name}"
            )


def test_json_to_sql_generates_valid_sql():
    """Test that json_to_sql generates valid SQL statements"""
    MODULE_DIR = Path(__file__).parent.parent
    registry = get_json(str(MODULE_DIR / "database/registry.json"))

    # Test with one semantic layer
    config = registry["semantic_layers"]["dates"]
    schema_path = MODULE_DIR / config["schema"]
    sql = json_to_sql(str(schema_path))

    assert sql.startswith("CREATE TABLE IF NOT EXISTS"), (
        "SQL should start with CREATE TABLE"
    )
    assert "dates" in sql.lower(), "SQL should reference the table name"


def test_sql_files_generated():
    """Test that SQL files are generated in correct locations"""
    MODULE_DIR = Path(__file__).parent.parent

    # Check semantic_layers sqls
    semantic_sqls_dir = MODULE_DIR / "semantic_layers/sqls"
    assert semantic_sqls_dir.exists(), "semantic_layers/sqls directory should exist"

    # Check facts sqls
    facts_sqls_dir = MODULE_DIR / "facts/sqls"
    assert facts_sqls_dir.exists(), "facts/sqls directory should exist"
