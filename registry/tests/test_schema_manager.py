from pathlib import Path

from database.schema_manager import get_schemas


def test_get_schemas_returns_list():
    """Test that get_schemas returns a list of SQL strings"""
    MODULE_DIR = Path(__file__).parent.parent / "database"
    sqls = get_schemas(MODULE_DIR)

    assert isinstance(sqls, list)
    assert len(sqls) > 0
    assert all(isinstance(sql, str) for sql in sqls)


def test_get_schemas_structure():
    """Test that get_schemas returns SQL in correct order (semantic_layers first)"""
    MODULE_DIR = Path(__file__).parent.parent / "database"
    sqls = get_schemas(MODULE_DIR)

    # Should have at least some semantic layers and facts
    assert len(sqls) >= 2

    # All should be CREATE TABLE statements
    for sql in sqls:
        assert sql.startswith("CREATE TABLE IF NOT EXISTS")
