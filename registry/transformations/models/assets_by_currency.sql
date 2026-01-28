{{config(materialized='view')}}

with assets_values as (
    select * from {{ref('assets_values')}}
)

select
    date,
    weeknum,
    currency,
    sum(amount) as total_amount
from assets_values
group by date, weeknum, currency
order by weeknum
