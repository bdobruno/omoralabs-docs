{{config (materialized='view')}}

with assets_by_currency as (
    select * from  {{ref('assets_by_currency')}}
),

currencies as (
    select * from {{ref('currencies')}}
),

reporting_rates as (
    select * from  {{ref('reporting_rates')}}
)

select
    abc.date,
    abc.weeknum,
    abc.currency,
    abc.total_amount as amount,
    c.currency_code as reporting_currency,
    COALESCE(rr.value, 1) as conversion_rate,
    ROUND (
        case
            when abc.currency = c.currency_code then abc.total_amount
            else abc.total_amount * rr.value
        end, 2) as converted_value
from currencies c
cross join assets_by_currency abc
left join reporting_rates rr
    on abc.date = rr.date
    and abc.currency = rr.base_currency
    and c.currency_code = rr.quote_currency
order by abc.weeknum
