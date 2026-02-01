CREATE TABLE IF NOT EXISTS gl_accounts (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    parent_gl INTEGER,
    gl_account_type_id INTEGER,
    business_unit_id INTEGER,
    FOREIGN KEY (gl_account_type_id) REFERENCES gl_accounts_types(id),
    FOREIGN KEY (business_unit_id) REFERENCES business_units(id)
)