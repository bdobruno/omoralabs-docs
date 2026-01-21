def create_business_units() -> str:
    """
    Create business units table SQL.
    """
    sql = """
        CREATE TABLE IF NOT EXISTS business_units (
            id INTEGER PRIMARY KEY,
            name VARCHAR NOT NULL,
            )"""

    return sql