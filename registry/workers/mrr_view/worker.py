import polars as pl


def generate_net_new_customers(df: pl.DataFrame) -> pl.DataFrame:
    return df.group_by(["date", "value_type_id"]).agg(
        (
            pl.col("total_mrr")
            .filter(pl.col("revenue_type_id") == 1)
            .first()
            .fill_null(0)  # New Bookings (0 if missing)
            + pl.col("total_mrr")
            .filter(pl.col("revenue_type_id") == 2)
            .first()
            .fill_null(0)  # Upsell (0 if missing)
            - pl.col("total_mrr")
            .filter(pl.col("revenue_type_id") == 3)
            .first()
            .fill_null(0)  # Downsell (0 if missing)
            - pl.col("total_mrr")
            .filter(pl.col("revenue_type_id") == 4)
            .first()
            .fill_null(0)  # Churn (0 if missing)
        ).alias("net_new_mrr")
    )


def generate_cum_net_new(df: pl.DataFrame) -> pl.DataFrame:
    return df.sort("date").with_columns(
        (pl.col("net_new_mrr").cum_sum().over("value_type_id")).alias("cum_net_new_mrr")
    )


def generate_current_and_ending_balance(df: pl.DataFrame) -> pl.DataFrame:
    return df.with_columns(
        [
            pl.col("cum_net_new_mrr")
            .shift(1)
            .over("value_type_id")
            .fill_null(0)
            .add(pl.col("total_mrr"))
            .alias("current_base"),
            pl.col("cum_net_new_mrr").add(pl.col("total_mrr")).alias("ending_balance"),
        ]
    )


def get_total_mrr(df: pl.DataFrame) -> pl.DataFrame:
    return df.with_columns(
        (pl.col("nr_of_customers") * pl.col("mrr_per_customer")).alias("total_mrr")
    )


def run_worker(
    revenue_info_df: pl.DataFrame, starting_balance_df: pl.DataFrame
) -> tuple:
    """
    Calculates mrr metrics from revenue changes and starting balance.

    Args:
        revenue_info_df: Revenue changes with columns: date, revenue_type_id, value_type_id, nr_of_customers
        starting_balance_df: Starting customer counts with columns: value_type_id, nr_of_customers

    Returns:
        DataFrame with columns: date, value_type_id, net_new_mrr, cum_net_new_mrr, current_base, ending_balance
    """

    revenue_mrr = get_total_mrr(revenue_info_df)
    revenue_changes_mrr = revenue_mrr.select(
        "date", "revenue_type_id", "value_type_id", "total_mrr"
    )

    starting_balance_with_total_mrr = get_total_mrr(starting_balance_df)
    starting_mrr = starting_balance_with_total_mrr.select(
        "date", "value_type_id", "total_mrr"
    )

    df_with_new_mrr = generate_net_new_customers(revenue_mrr)
    df_with_cum_new = generate_cum_net_new(df_with_new_mrr)

    df_with_starting = df_with_cum_new.join(
        starting_balance_with_total_mrr.select("value_type_id", "total_mrr"),
        on="value_type_id",
        how="left",
    )

    ending_df = generate_current_and_ending_balance(df_with_starting)

    mrr_view = ending_df.select(
        "date",
        "value_type_id",
        "net_new_mrr",
        "cum_net_new_mrr",
        "current_base",
        "ending_balance",
    )

    return mrr_view, revenue_changes_mrr, starting_mrr
