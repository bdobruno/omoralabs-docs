{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('plan_vs_actuals', 'pnl') }}
