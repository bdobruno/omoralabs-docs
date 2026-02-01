from .worker import run_worker


def orchestrator(db) -> None:
    """
    Worker orchestrator
    """
    revenue_info_df = db.get_revenue_changes_df()
    starting_balance_df = db.get_starting_balance_df()
    mrr_view, revenue_changes_mrr, starting_mrr = run_worker(
        revenue_info_df, starting_balance_df
    )

    db.insert_pl_dataframe(mrr_view, "mrr_view")
    db.update_mrr_rev_changes(revenue_changes_mrr)
    db.update_mrr_starting_balance(starting_mrr)
