import polars as pl
import requests


def get_exchange_rates_per_date(ex_rates_df: pl.DataFrame) -> pl.DataFrame:
    """
    Fetch exchange rates for given dates and currency pairs.

    Args:
        ex_rates_df: DataFrame with columns: date, base_currency, quote_currency

    Returns:
        DataFrame with exchange rates
    """
    exchange_rates = []
    for row in ex_rates_df.iter_rows(named=True):
        date = row["date"]
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
                "base_currency": base,
                "quote_currency": quote,
                "rate": rates[quote.lower()],
            }
        )

    return pl.DataFrame(exchange_rates)
