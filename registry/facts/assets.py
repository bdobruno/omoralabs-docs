import numpy as np
import polars as pl

from weekly_cash_balances.data.utils import get_df_from_json
from weekly_cash_balances.db.db import DuckDB


class Assets:
    def __init__(self, dates_df: pl.DataFrame):
        self.assets_main_df = pl.DataFrame()
        self.suppliers_df = pl.DataFrame()
        self.assets_df = pl.DataFrame()
        self.asset_values_df = pl.DataFrame()
        self.asset_types_df = pl.DataFrame()
        self.dates_df = dates_df

        self.setup_assets_df_main()
        self.setup_asset_types_df()
        self.create_and_insert_suppliers_df()
        self.create_and_insert_assets_df()
        self.create_and_insert_asset_values_df()

    def setup_assets_df_main(self) -> None:
        path = "src/weekly_cash_balances/data/sample/assets.json"
        self.assets_main_df = get_df_from_json(path)

    def setup_asset_types_df(self) -> None:
        path = "src/weekly_cash_balances/data/sample/asset_types.json"
        self.asset_types_df = get_df_from_json(path)

    def create_and_insert_suppliers_df(self) -> None:
        self.suppliers_df = (
            self.assets_main_df.select("supplier").unique().rename({"supplier": "name"})
        )
        with DuckDB() as db:
            db.insert_data(self.suppliers_df, "account_suppliers")

    def create_and_insert_assets_df(self) -> None:
        with DuckDB() as db:
            suppliers_df = db.get_account_suppliers()

            self.assets_df = (
                self.assets_main_df.select("id", "currency_id", "supplier")
                .join(
                    suppliers_df.rename({"id": "supplier_id"}),
                    left_on="supplier",
                    right_on="name",
                    how="left",
                )
                .select("id", "currency_id", "supplier_id")
            )
            db.insert_data(self.assets_df, "assets")

    def create_and_insert_asset_values_df(self) -> None:
        self.asset_values_df = (
            self.dates_df.join(
                self.assets_main_df.select("id", "starting_balance", "type").rename(
                    {"id": "asset_id"}
                ),
                how="cross",
            )
            .join(self.asset_types_df, on="type", how="left")
            .sort("asset_id", "week_start")
        )

        self.asset_values_df = (
            self.asset_values_df.with_columns(
                pl.Series(
                    "random_sign",
                    np.random.choice([-1, 1], size=len(self.asset_values_df)),
                )
            )
            .with_columns(
                pl.when(
                    pl.col("week_start")
                    == pl.col("week_start").first().over("asset_id")
                )
                .then(pl.col("starting_balance"))
                .otherwise(
                    (
                        pl.col("starting_balance").shift(1).over("asset_id")
                        * (1 + pl.col("volatility") * pl.col("random_sign"))
                    ).clip(lower_bound=0)
                )
                .alias("value")
            )
            .select("asset_id", "value", "week_start")
        )
        with DuckDB() as db:
            db.insert_data(self.asset_values_df, "asset_values")