{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('saas_metrics', 'revenue_changes') }}
