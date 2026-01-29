{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('saas_metrics', 'value_types') }}
