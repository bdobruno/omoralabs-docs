CREATE TABLE IF NOT EXISTS exchange_rates (
    date DATE NOT NULL,
    currency_pair_id INTEGER NOT NULL,
    value DOUBLE NOT NULL,
    FOREIGN KEY (date) REFERENCES dates(date),
    FOREIGN KEY (currency_pair_id) REFERENCES currency_pairs(id),
    PRIMARY KEY (date, currency_pair_id)
)