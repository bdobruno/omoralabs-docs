CREATE TABLE IF NOT EXISTS revenue_changes (
    date DATE NOT NULL,
    revenue_type_id INTEGER NOT NULL,
    value_type_id INTEGER NOT NULL,
    nr_of_customers INTEGER NOT NULL,
    mrr_per_customer DOUBLE NOT NULL,
    total_mrr DOUBLE,
    FOREIGN KEY (date) REFERENCES dates(date),
    FOREIGN KEY (revenue_type_id) REFERENCES revenue_types(id),
    FOREIGN KEY (value_type_id) REFERENCES value_types(id),
    PRIMARY KEY (date, revenue_type_id, value_type_id)
)