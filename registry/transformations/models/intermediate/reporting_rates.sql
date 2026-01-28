{{ config (materialized='view') }}

with exchange_rates as (
    select * from {{ ref('exchange_rates') }}
),

currency_pairs as (
    select * from {{ ref ('currency_pairs') }}
),

currencies as (
    select * from {{ref ('currencies') }}
),


rates as (
select
    er.date,
    EXTRACT(ISOYEAR FROM er.date) * 100 + EXTRACT(WEEK FROM er.date) as weeknum,
    c1.currency_code as base_currency,
    c2.currency_code as quote_currency,
    er.value
from exchange_rates er
join currency_pairs cp on er.currency_pair_id = cp.id
join currencies c1 on cp.base_currency_id = c1.id
join currencies c2 on cp.quote_currency_id = c2.id
),

inverse_rates as (
    select
        date,
        weeknum,
        quote_currency as base_currency,
        base_currency as quote_currency,
        1/value as value
    from rates
)

select * from rates
union all
select * from inverse_rates
