from pathlib import Path

from .utils import (
    get_registry_with_resolved_paths,
    json_to_sql,
    resolve_dependency_order,
)


def resolve_dependencies(registry_section):
    """
    Get SQL CREATE TABLE statements in dependency order.

    Args:
        registry_section: Dictionary section (e.g., semantic_layers or facts)

    Returns:
        List of SQL CREATE TABLE statements in dependency order
    """
    schema_paths = resolve_dependency_order(registry_section)
    return [json_to_sql(schema_path) for schema_path in schema_paths]


def get_schemas(registry_path: Path) -> list:
    """
    Orchestrator: generates all semantic_layers first, then all facts.

    Args:
        registry_path: Path to the registry directory

    Returns:
        List of SQL CREATE TABLE statements in dependency order
    """
    registry = get_registry_with_resolved_paths(registry_path)

    # First: all semantic_layers
    semantic = resolve_dependencies(registry["semantic_layers"])

    # Then: all facts
    facts = resolve_dependencies(registry["facts"])

    return semantic + facts
