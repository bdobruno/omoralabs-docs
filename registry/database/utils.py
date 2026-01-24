import json
from pathlib import Path


def get_json(json_path: str) -> dict:
    with open(json_path) as f:
        return json.load(f)


def get_registry_with_resolved_paths(module_dir: Path) -> dict:
    """
    Load registry.json and resolve all schema paths to absolute.

    Args:
        module_dir: Directory containing registry.json (usually database/)

    Returns:
        Registry dict with resolved absolute paths
    """
    registry = get_json(str(module_dir / "registry.json"))

    # Resolve all relative paths to absolute
    for section in ["semantic_layers", "facts"]:
        for config in registry[section].values():
            config["schema"] = str(module_dir.parent / config["schema"])

    return registry


def resolve_dependency_order(registry_section):
    """
    Resolve dependencies and return schema paths in correct order.

    Args:
        registry_section: Dictionary section (e.g., semantic_layers or facts)

    Returns:
        List of schema paths in dependency order
    """

    def resolve(dim, visited=None):
        if visited is None:
            visited = set()
        if dim in visited:
            return []
        visited.add(dim)

        schemas = []
        for dep in registry_section[dim]["dependencies"]:
            # Only resolve if dependency is in same section
            if dep in registry_section:
                schemas.extend(resolve(dep, visited))
        schemas.append(registry_section[dim]["schema"])
        return schemas

    result = []
    seen = set()
    for dim in registry_section.keys():
        for schema_path in resolve(dim):
            if schema_path not in seen:
                result.append(schema_path)
                seen.add(schema_path)
    return result


def append_fields(json) -> list:
    fields = []
    for name, props in json["fields"].items():
        fields.append(f"{name} {props['type']}")
    return fields


def append_fks(json) -> list:
    fks = []
    for fk in json.get("foreign_keys", []):
        fks.append(f"FOREIGN KEY ({fk['field']}) REFERENCES {fk['references']}")
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
