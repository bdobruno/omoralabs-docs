{{config(materialized='view')}}

with assets_providers as (
    select * from {{ref('assets_providers') }}
),

currencies as (
    select * from {{ ref('currencies') }}
)

select
    asp.name as asset_provider,
    asp.id as asset_id,
    c.currency_code as currency
from assets_providers asp
left join currencies c on asp.currency_id = c.id
