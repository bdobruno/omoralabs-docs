CREATE TABLE IF NOT EXISTS pnl (
    date DATE NOT NULL,
    gl_account_id INTEGER NOT NULL,
    value_type_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (date) REFERENCES dates(date),
    FOREIGN KEY (gl_account_id) REFERENCES gl_accounts(id),
    FOREIGN KEY (value_type_id) REFERENCES value_types(id),
    PRIMARY KEY (date, gl_account_id, value_type_id)
)