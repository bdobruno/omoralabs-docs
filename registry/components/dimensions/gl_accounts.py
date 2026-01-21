def create_gl_accounts(is_segmented: bool) -> str:
    """
    Create gl_accounts table SQL.
    Args:
        is_segmented: Whether to include business unit segmentations
    """
    sql = """
        CREATE TABLE IF NOT EXISTS gl_accounts (
            id INTEGER PRIMARY KEY,
            name VARCHAR NOT NULL,
            parent_gl INTEGER,"""

    addition = """
        business_unit_id INTEGER,
        FOREIGN KEY(business_unit_id) REFERENCES business_unit(id) ON DELETE CASCADE,"""

    sql_close = """
        FOREIGN KEY (parent_gl) REFERENCES gl_accounts(id) ON DELETE SET NULL)"""

    return sql + (addition if is_segmented else "") + sql_close
