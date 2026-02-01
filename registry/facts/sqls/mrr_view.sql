CREATE TABLE IF NOT EXISTS mrr_view (
    date DATE NOT NULL,
    value_type_id INTEGER NOT NULL,
    net_new_mrr INTEGER NOT NULL,
    cum_net_new_mrr INTEGER NOT NULL,
    current_base INTEGER NOT NULL,
    ending_balance INTEGER NOT NULL,
    FOREIGN KEY (date) REFERENCES dates(date),
    FOREIGN KEY (value_type_id) REFERENCES value_types(id),
    PRIMARY KEY (date, value_type_id)
)