CREATE TABLE IF NOT EXISTS currency_pairs (
    id INTEGER PRIMARY KEY,
    base_currency_id INTEGER NOT NULL,
    quote_currency_id INTEGER NOT NULL,
    FOREIGN KEY (base_currency_id) REFERENCES currencies(id),
    FOREIGN KEY (quote_currency_id) REFERENCES currencies(id)
)