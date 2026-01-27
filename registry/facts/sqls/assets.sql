CREATE TABLE IF NOT EXISTS assets (
    period_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (period_id) REFERENCES periods(id),
    PRIMARY KEY (period_id, asset_id)
)