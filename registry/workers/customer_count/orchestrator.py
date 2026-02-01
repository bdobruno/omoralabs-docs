from .worker import run_worker


def orchestrator(db) -> None:
    """
    Worker orchestrator
    """
    revenue_info_df = db.get_revenue_changes_df()
    starting_balance_df = db.get_starting_balance_df()
    revenue_aggregations_df = run_worker(
        revenue_info_df, starting_balance_df
    )

    db.insert_pl_dataframe(revenue_aggregations_df, "customer_count")
