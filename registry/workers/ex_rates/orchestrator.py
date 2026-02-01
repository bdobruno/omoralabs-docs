from .worker import run_worker


def orchestrator(db) -> None:
    """
    Worker orchestrator
    """
    currency_pairs_df = db.get_currency_pairs_df()
    exchange_rates_df = run_worker(currency_pairs_df)

    db.insert_pl_dataframe(exchange_rates_df, "exchange_rates")
