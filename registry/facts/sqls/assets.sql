CREATE TABLE IF NOT EXISTS assets (
    date INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (date) REFERENCES dates(date),
    PRIMARY KEY (date, asset_id)
)