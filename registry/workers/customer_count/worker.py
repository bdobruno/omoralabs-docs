import polars as pl


def generate_net_new_customers(revenue_info_df: pl.DataFrame) -> pl.DataFrame:
    return revenue_info_df.group_by(["date", "value_type_id"]).agg(
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


def generate_end_balance(revenue_info_df: pl.DataFrame) -> pl.DataFrame:
    return revenue_info_df.sort("date").with_columns(
        (
            pl.col("net_new").cum_sum().over("value_type_id")
        ).alias("cum_net_new")
    )


def process_customer_count(revenue_info_df: pl.DataFrame) -> pl.DataFrame:
    """ """

    df_with_new_customers = generate_net_new_customers(revenue_info_df)
    df_with_end_balance = generate_end_balance(df_with_new_customers)

    final_df = df_with_end_balance.select(
        "date", "value_type_id", "net_new", "cum_net_new"
    )

    return final_df
