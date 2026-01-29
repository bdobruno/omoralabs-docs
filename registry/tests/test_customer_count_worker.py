import polars as pl
from pathlib import Path
import sys

# Add workers to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from workers.customer_count.worker import (
    generate_net_new_customers,
    generate_end_balance,
    process_customer_count,
)


def test_process_customer_count_no_duplicates():
    """Test that process_customer_count produces unique (date, value_type_id) rows"""

    # Load test data - only revenue_changes (no starting balance)
    registry_path = Path(__file__).parent.parent
    revenue_changes = pl.read_csv(registry_path / "facts" / "revenue_changes.csv")

    # Process
    result = process_customer_count(revenue_changes)

    # Check no duplicates - length should equal unique combinations
    assert len(result) == result.select(["date", "value_type_id"]).unique().height

    # Check all rows have values
    assert result["net_new"].null_count() == 0
    assert result["cum_net_new"].null_count() == 0


def test_net_new_calculation():
    """Test net_new = new_bookings - churn per date"""

    test_data = pl.DataFrame({
        "date": ["2025-01-01", "2025-01-01", "2025-01-01"],
        "revenue_type_id": [1, 4, 2],  # new_booking, churn, other
        "value_type_id": [2, 2, 2],
        "nr_of_customers": [100, 20, 5],
        "value_per_customer": [5000.0, 5000.0, 1000.0],
    })

    result = process_customer_count(test_data)

    # Check the calculation for our test date
    assert len(result) == 1  # Only one (date, value_type_id) combination
    assert result["date"][0] == "2025-01-01"
    assert result["value_type_id"][0] == 2
    assert result["net_new"][0] == 80  # 100 - 20
    assert result["cum_net_new"][0] == 80  # First row, cumsum = 80


def test_cumulative_net_new():
    """Test cum_net_new is cumulative sum of net_new per value_type"""

    test_data = pl.DataFrame({
        "date": ["2025-01-01", "2025-02-01", "2025-03-01", "2025-01-01", "2025-02-01"],
        "revenue_type_id": [1, 1, 1, 1, 1],
        "value_type_id": [2, 2, 2, 3, 3],  # Two different value types
        "nr_of_customers": [60, 60, 60, 10, 10],
        "value_per_customer": [5000.0, 5000.0, 5000.0, 1000.0, 1000.0],
    })

    # Add some churn rows
    churn_data = pl.DataFrame({
        "date": ["2025-01-01", "2025-02-01", "2025-03-01"],
        "revenue_type_id": [4, 4, 4],
        "value_type_id": [2, 2, 2],
        "nr_of_customers": [0, 0, 0],
        "value_per_customer": [5000.0, 5000.0, 5000.0],
    })

    combined = pl.concat([test_data, churn_data])
    result = process_customer_count(combined)

    # For value_type_id=2: net_new should be [60, 60, 60], cum_net_new should be [60, 120, 180]
    vt2 = result.filter(pl.col("value_type_id") == 2).sort("date")
    assert vt2["cum_net_new"].to_list() == [60, 120, 180]

    # For value_type_id=3: net_new should be [10, 10], cum_net_new should be [10, 20]
    vt3 = result.filter(pl.col("value_type_id") == 3).sort("date")
    assert vt3["cum_net_new"].to_list() == [10, 20]
