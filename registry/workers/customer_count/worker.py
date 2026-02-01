import polars as pl


def generate_net_new_customers(df: pl.DataFrame) -> pl.DataFrame:
    return df.group_by(["date", "value_type_id"]).agg(
        (
            pl.col("nr_of_customers")
            .filter(pl.col("revenue_type_id") == 1)
            .first()
            .fill_null(0)  # New Bookings (0 if missing)
            - pl.col("nr_of_customers")
            .filter(pl.col("revenue_type_id") == 4)
            .first()
            .fill_null(0)  # Churn (0 if missing)
        ).alias("net_new")
    )


def generate_cum_net_new(df: pl.DataFrame) -> pl.DataFrame:
    return df.sort("date").with_columns(
        (pl.col("net_new").cum_sum().over("value_type_id")).alias("cum_net_new")
    )


def generate_current_and_ending_balance(df: pl.DataFrame) -> pl.DataFrame:
    return df.with_columns(
        [
            pl.col("cum_net_new")
            .shift(1)
            .over("value_type_id")
            .fill_null(0)
            .add(pl.col("nr_of_customers"))
            .alias("current_base"),
            pl.col("cum_net_new")
            .add(pl.col("nr_of_customers"))
            .alias("ending_balance"),
        ]
    )


def run_worker(
    revenue_info_df: pl.DataFrame, starting_balance_df: pl.DataFrame
) -> pl.DataFrame:
    """
    Calculates customer count metrics from revenue changes and starting balance.

    Args:
        revenue_info_df: Revenue changes with columns: date, revenue_type_id, value_type_id, nr_of_customers
        starting_balance_df: Starting customer counts with columns: value_type_id, nr_of_customers

    Returns:
        DataFrame with columns: date, value_type_id, net_new, cum_net_new, current_base, ending_balance
    """

    df_with_new_customers = generate_net_new_customers(revenue_info_df)
    df_with_cum_new = generate_cum_net_new(df_with_new_customers)

    df_with_starting = df_with_cum_new.join(
        starting_balance_df.select("value_type_id", "nr_of_customers"),
        on="value_type_id",
        how="left",
    )

    ending_df = generate_current_and_ending_balance(df_with_starting)

    final_df = ending_df.select(
        "date",
        "value_type_id",
        "net_new",
        "cum_net_new",
        "current_base",
        "ending_balance",
    )

    return final_df
