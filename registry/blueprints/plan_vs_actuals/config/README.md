# Plan vs Actuals Variance Analysis

A production-grade financial variance analysis blueprint built on **Omora Labs** components. This system demonstrates how semantic layers, facts, transformations, and reporting work together to deliver automated budget vs actuals analysis with hierarchical P&L rollup.

## Installation

```bash
# Install dependencies
uv sync
```

## Usage

```bash
# To create a local db and loaded it with data
uv run omora-local

# To create a remote db and loaded it with data
uv run omora-remote

# Run dbt transformations
cd src/plan_vs_actuals/plan_vs_actuals_dbt
uv run dbt run
```

## License

This project is licensed under the MIT License.
