CREATE TABLE IF NOT EXISTS customer_count (
    date DATE NOT NULL,
    value_type_id INTEGER NOT NULL,
    net_new INTEGER NOT NULL,
    cum_net_new INTEGER NOT NULL,
    FOREIGN KEY (date) REFERENCES dates(date),
    FOREIGN KEY (value_type_id) REFERENCES value_types(id),
    PRIMARY KEY (date, value_type_id)
)