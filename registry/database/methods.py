from typing import List

import duckdb
import polars as pl


class DBConnect:
    def __init__(self, db_name: str, remote: bool = False):
        self.db_name = db_name
        self.remote = remote

        if self.remote:
            self.conn = duckdb.connect("md:")
            self.conn.execute(f"CREATE DATABASE IF NOT EXISTS {self.db_name}")
            self.conn.execute(f"USE {self.db_name}")
        else:
            self.conn = duckdb.connect(self.db_name)

    def __enter__(self):
        self.conn.begin()
        return self

    def __exit__(self, exc_type, exc_value, exc_tb):
        if exc_type is not None:
            self.conn.rollback()
        else:
            self.conn.commit()
        self.conn.close()
        return False

    def implement_tables(self, sqls: List) -> None:
        """
        Execute all CREATE TABLE statements from self.sqls.
        """
        for sql in sqls:
            self.conn.execute(sql)

    def insert_pl_dataframe(self, df: pl.DataFrame, table: str) -> None:
        cols = ", ".join(df.columns)
        self.conn.execute(
            f"""
            INSERT INTO {table} ({cols}) SELECT * FROM df
            """
        )

    def insert_csvs(self, file: str, table: str) -> None:
        self.conn.execute(
            f"""
            INSERT INTO {table} SELECT * FROM '{file}'
            """
        )

    def update_mrr_rev_changes(self, df: pl.DataFrame) -> None:
        self.conn.execute(
            """
            UPDATE revenue_changes rc
            SET total_mrr = df.total_mrr
            FROM df
            WHERE rc.date = df.date
                AND rc.revenue_type_id = df.revenue_type_id
                AND rc.value_type_id = df.value_type_id
            """
        )

    def update_mrr_starting_balance(self, df: pl.DataFrame) -> None:
        self.conn.execute(
            """
            UPDATE revenue_starting_balance rsb
            SET total_mrr = df.total_mrr
            FROM df
            WHERE rsb.date = df.date
                AND rsb.value_type_id = df.value_type_id
            """
        )

    def get_currency_pairs_df(self) -> pl.DataFrame:
        return self.conn.execute(
            """
            WITH unique_dates AS (
                SELECT DISTINCT date
                FROM assets
            ),
            unique_currencies AS (
                SELECT DISTINCT ap.currency_id
                FROM assets_providers ap
                JOIN assets a ON a.asset_id = ap.id
            ),
            required_pairs as (
                SELECT DISTINCT
                    c1.currency_id as base_currency,
                    c2.currency_id as quote_currency
                FROM unique_currencies c1
                CROSS JOIN unique_currencies c2
                WHERE c1.currency_id != c2.currency_id
            )
            SELECT
                d.date,
                cp.id as currency_pair_id,
                base.currency_code as base_currency,
                quote.currency_code as quote_currency
            FROM unique_dates d
            CROSS JOIN currency_pairs cp
            JOIN currencies base ON cp.base_currency_id = base.id
            JOIN currencies quote ON cp.quote_currency_id = quote.id
            WHERE EXISTS (
                SELECT 1 from required_pairs rp
                WHERE rp.base_currency = cp.base_currency_id
                AND rp.quote_currency = cp.quote_currency_id
            )
            """
        ).pl()

    def get_revenue_changes_df(self) -> pl.DataFrame:
        return self.conn.execute(
            """
            SELECT
                date,
                revenue_type_id,
                value_type_id,
                nr_of_customers,
                mrr_per_customer
            FROM revenue_changes
            ORDER BY date
            """
        ).pl()

    def get_starting_balance_df(self) -> pl.DataFrame:
        return self.conn.execute(
            """
            SELECT * FROM revenue_starting_balance
            """
        ).pl()
