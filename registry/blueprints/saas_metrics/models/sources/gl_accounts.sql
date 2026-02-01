{{config(materialized='ephemeral')}}

SELECT * FROM {{ source('saas_metrics', 'gl_accounts') }}
