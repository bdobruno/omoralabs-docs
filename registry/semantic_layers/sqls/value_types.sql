CREATE TABLE IF NOT EXISTS value_types (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE CHECK (name IN ('actuals', 'budget', 'le3-9', 'le6-6', 'le9-3'))
)