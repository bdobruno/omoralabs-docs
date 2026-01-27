CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    asset_type_id INTEGER NOT NULL,
    currency_id INTEGER NOT NULL,
    FOREIGN KEY (asset_type_id) REFERENCES asset_types(id),
    FOREIGN KEY (currency_id) REFERENCES currencies(id)
)