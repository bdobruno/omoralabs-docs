{{config(materialised='view')}}

with assets_converted as (
    select * from {{ref ('assets_converted') }}
)

select
    date,
    weeknum,
    reporting_currency,
    ROUND(
        sum(converted_value)
        ,2) as converted_cash_balances
from assets_converted
group by date, weeknum, reporting_currency
order by weeknum
