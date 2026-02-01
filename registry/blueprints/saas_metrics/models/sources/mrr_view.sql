{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('saas_metrics', 'mrr_view') }}
