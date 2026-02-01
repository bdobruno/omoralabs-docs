{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('saas_metrics', 'pnl') }}
