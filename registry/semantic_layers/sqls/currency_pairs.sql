CREATE TABLE IF NOT EXISTS currency_pairs (
    base_currency_id INTEGER,
    quote_currency_id INTEGER,
    FOREIGN KEY (base_currency_id) REFERENCES currencies(id),
    FOREIGN KEY (quote_currency_id) REFERENCES currencies(id),
    PRIMARY KEY (base_currency_id, quote_currency_id)
)