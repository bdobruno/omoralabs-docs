from typing import List

import duckdb
import polars as pl


class DBConnect:
    def __init__(self, db_name: str):
        self.db_name = db_name
        self.conn = duckdb.connect(db_name)

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
