{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('saas_metrics', 'customer_count') }}
