from .worker import get_exchange_rates_per_date


def orchestrator(db) -> None:
    currency_pairs_df = db.get_currency_pairs_df()
    exchange_rates_df = get_exchange_rates_per_date(currency_pairs_df)

    db.insert_pl_dataframe(exchange_rates_df, "exchange_rates")
