CREATE TABLE IF NOT EXISTS revenue_types (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL CHECK (name IN ('new_booking', 'upsell', 'downsell', 'churn'))
)