import polars as pl
import requests


def get_exchange_rates_per_date(currency_pairs_df: pl.DataFrame) -> pl.DataFrame:
    """
    Fetch exchange rates for given dates and currency pairs.

    Args:
        currency_pairs_df: DataFrame with columns: date, currency_pair_id, base_currency, quote_currency

    Returns:
        DataFrame with exchange rates
    """
    exchange_rates = []
    for row in currency_pairs_df.iter_rows(named=True):
        date = row["date"]
        currency_pair_id = row["currency_pair_id"]
        base = row["base_currency"]
        quote = row["quote_currency"]

        print(f"Fetching exchange rate for date {date} and FX Pair {base}/{quote}")

        response = requests.get(
            f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/currencies/{base.lower()}.json"
        )
        rates = response.json()[base.lower()]
        exchange_rates.append(
            {
                "date": date,
                "currency_pair_id": currency_pair_id,
                "value": rates[quote.lower()],
            }
        )

    return pl.DataFrame(exchange_rates)
