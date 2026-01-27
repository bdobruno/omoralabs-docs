import os
from pathlib import Path

import duckdb
import pytest

from database.methods import DBConnect
from database.schema_manager import get_schemas


@pytest.fixture
def test_db_path(tmp_path):
    """Fixture to provide a temporary database path"""
    return str(tmp_path / "test.db")


@pytest.fixture
def db_connection(test_db_path):
    """Fixture to create a database connection"""
    db = DBConnect(test_db_path)
    yield db
    # Cleanup
    db.conn.close()
    if os.path.exists(test_db_path):
        os.remove(test_db_path)


def test_db_connect_initialization(test_db_path):
    """Test that DBConnect initializes correctly"""
    db = DBConnect(test_db_path)

    assert db.db_name == test_db_path
    assert db.conn is not None
    assert isinstance(db.conn, duckdb.DuckDBPyConnection)

    db.conn.close()
    os.remove(test_db_path)


def test_implement_tables_creates_all_tables(db_connection):
    """Test that implement_tables creates all tables from schemas"""
    MODULE_DIR = Path(__file__).parent.parent / "database"
    sqls = get_schemas(MODULE_DIR)

    # Execute all CREATE TABLE statements
    db_connection.implement_tables(sqls)

    # Verify tables were created
    tables_query = (
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main'"
    )
    result = db_connection.conn.execute(tables_query).fetchall()
    table_names = [row[0] for row in result]

    # Check expected semantic layer tables exist
    expected_tables = ["dates", "value_types", "gl_accounts_types"]
    for table in expected_tables:
        assert table in table_names, f"Table {table} should be created"

    # Check expected fact tables exist
    expected_fact_tables = ["pnl"]
    for table in expected_fact_tables:
        assert table in table_names, f"Fact table {table} should be created"


def test_implement_tables_with_foreign_keys(db_connection):
    """Test that tables with foreign key dependencies are created correctly"""
    MODULE_DIR = Path(__file__).parent.parent / "database"
    sqls = get_schemas(MODULE_DIR)

    # This should not raise an error even with FK dependencies
    db_connection.implement_tables(sqls)

    # Verify a table with FK exists (pnl depends on dates, value_types, gl_accounts)
    tables_query = (
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main'"
    )
    result = db_connection.conn.execute(tables_query).fetchall()
    table_names = [row[0] for row in result]

    assert "pnl" in table_names


def test_implement_tables_idempotent(db_connection):
    """Test that implement_tables can be run multiple times (IF NOT EXISTS)"""
    MODULE_DIR = Path(__file__).parent.parent / "database"
    sqls = get_schemas(MODULE_DIR)

    # Run twice - should not error
    db_connection.implement_tables(sqls)
    db_connection.implement_tables(sqls)

    # Verify tables still exist
    tables_query = (
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main'"
    )
    result = db_connection.conn.execute(tables_query).fetchall()
    table_names = [row[0] for row in result]

    assert len(table_names) > 0


def test_full_workflow(test_db_path):
    """Integration test: full workflow of creating DB, getting schemas, implementing tables"""
    # Step 1: Create DB
    db = DBConnect(test_db_path)
    assert db.conn is not None

    # Step 2: Generate SQLs
    MODULE_DIR = Path(__file__).parent.parent / "database"
    sqls = get_schemas(MODULE_DIR)
    assert len(sqls) > 0

    # Step 3: Implement tables
    db.implement_tables(sqls)

    # Step 4: Verify all tables exist
    tables_query = (
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main'"
    )
    result = db.conn.execute(tables_query).fetchall()
    table_names = [row[0] for row in result]

    # Should have multiple tables
    assert len(table_names) >= 7  # At least 7 semantic layers + 2 facts

    # Cleanup
    db.conn.close()
    os.remove(test_db_path)
