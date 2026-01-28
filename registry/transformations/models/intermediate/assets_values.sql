{{config(materialized='view')}}

with assets_metadata as (
    select * from {{ ref ('assets_metadata') }}
),

asset_values as (
    select * from {{ref ('assets')}}
)

select
    av.date,
    EXTRACT(ISOYEAR from av.date) * 100 + EXTRACT(WEEK from av.date) as weeknum,
    am.asset_provider,
    am.asset_id,
    am.currency,
    COALESCE(av.amount,0) as amount,
from assets_metadata am
left join asset_values av on av.asset_id = am.asset_id
order by av.date, am.asset_id
