CREATE TABLE IF NOT EXISTS pnl (
    year_month INTEGER NOT NULL,
    gl_account_id INTEGER NOT NULL,
    value_type_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (year_month) REFERENCES periods(year_month),
    FOREIGN KEY (gl_account_id) REFERENCES gl_accounts(id),
    FOREIGN KEY (value_type_id) REFERENCES value_types(id),
    PRIMARY KEY (year_month, gl_account_id, value_type_id)
)