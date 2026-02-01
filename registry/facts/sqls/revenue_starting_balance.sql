CREATE TABLE IF NOT EXISTS revenue_starting_balance (
    date DATE NOT NULL,
    value_type_id INTEGER NOT NULL,
    nr_of_customers INTEGER NOT NULL,
    mrr_per_customer DOUBLE NOT NULL,
    total_mrr DOUBLE,
    FOREIGN KEY (date) REFERENCES dates(date),
    FOREIGN KEY (value_type_id) REFERENCES value_types(id),
    PRIMARY KEY (date, value_type_id)
)