CREATE TABLE IF NOT EXISTS revenue_types (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE CHECK (name IN ('new_booking', 'upsell', 'downsell', 'churn'))
)