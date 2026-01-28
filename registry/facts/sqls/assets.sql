CREATE TABLE IF NOT EXISTS assets (
    date DATE NOT NULL,
    asset_id UUID NOT NULL,
    amount DOUBLE NOT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets_providers(id),
    FOREIGN KEY (date) REFERENCES dates(date),
    PRIMARY KEY (date, asset_id)
)