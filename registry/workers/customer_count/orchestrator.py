from .worker import process_customer_count


def orchestrator(db) -> None:
    revenue_info_df = db.get_revenue_changes_df()
    revenue_aggregations_df = process_customer_count(revenue_info_df)

    db.insert_pl_dataframe(revenue_aggregations_df, "customer_count")
