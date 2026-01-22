from registry.components.database.methods import DBConnect
from registry.components.database.schema_manager import get_schemas


def main(db_name: str) -> None:
    """Set up the database schema for revenue_types"""

    table_name = "revenue_types"
    # Change path to your data location
    revenue_types = "registry/samples/revenue_types/sample.csv"

    try:
        print("Starting process...")
        print("Getting SQL Schemas...")
        sqls = get_schemas([f"{table_name}"])

        print("Starting DB...")
        db = DBConnect(db_name)
        db.implement_tables(sqls)

        print("Inserting data now...")
        db.insert_csvs(revenue_types, f"{table_name}")
        print(f"✓ {table_name} data inserted")

    except Exception as e:
        print(f"Failure setting up db schema and filling it in with sample data: {e}")
        raise


if __name__ == "__main__":
    db_name = "company_structure"  # write the db_name here
    main(db_name)
