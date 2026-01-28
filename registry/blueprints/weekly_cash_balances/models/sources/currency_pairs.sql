{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('weekly_cash_balances', 'currency_pairs') }}
