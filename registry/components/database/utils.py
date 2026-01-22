import json


def get_json(json_path: str) -> dict:
    with open(json_path) as f:
        return json.load(f)


def append_fields(json) -> list:
    fields = []
    for name, props in json["fields"].items():
        fields.append(f"{name} {props['type']}")
    return fields


def append_fks(json) -> list:
    fks = []
    for fk in json.get("foreign_keys", []):
        fks.append(
            f"FOREIGN KEY ({fk['field']}) REFERENCES {fk['references']} ON DELETE {fk['on_delete']}"
        )
    return fks


def json_to_sql(json_path: str) -> str:
    json_data = get_json(json_path)
    table_name = json_data["table_name"]

    fields = append_fields(json_data)
    fks = append_fks(json_data)

    # Combine all constraints
    all_constraints = fields + fks

    # Add composite primary key if defined
    if "primary_key" in json_data:
        pk_fields = ", ".join(json_data["primary_key"])
        all_constraints.append(f"PRIMARY KEY ({pk_fields})")

    # Format with indentation
    formatted_constraints = ",\n    ".join(all_constraints)

    return f"CREATE TABLE IF NOT EXISTS {table_name} (\n    {formatted_constraints}\n)"
