{{config(materialized='view')}}


with customer_count as (
    select * from {{ ref('customer_count') }}
),

starting_balance as (
    select
        value_type_id,
        nr_of_customers
    from {{ref('revenue_starting_balance')}}
),

changes as (
    select * from {{ref('revenue_changes')}}
),

customer_base as (
    select
        cc.date,
        cc.value_type_id,
        coalesce(
            lag(cc.cum_net_new + sb.nr_of_customers) over (partition by cc.value_type_id order by cc.date),
            sb.nr_of_customers
        ) as current_base,
        cc.net_new,
        cc.cum_net_new + sb.nr_of_customers as ending_balance
    from customer_count cc
    left join starting_balance sb on cc.value_type_id = sb.value_type_id
),

new_customers as (
    select
        date,
        value_type_id,
        nr_of_customers
    from changes
    where revenue_type_id = 1
),

upsell_customers as (
    select
        date,
        value_type_id,
        nr_of_customers
    from changes
    where revenue_type_id = 2
),

downsell_customers as (
    select
        date,
        value_type_id,
        nr_of_customers
    from changes
    where revenue_type_id = 3
),

churn_customers as (
    select
        date,
        value_type_id,
        nr_of_customers
    from changes
    where revenue_type_id = 4
)

select
    cb.date,
    cb.value_type_id,
    cb.current_base,
    nc.nr_of_customers as new_customers,
    uc.nr_of_customers as upsell,
    dc.nr_of_customers as downsell,
    chc.nr_of_customers as churn,
    cb.net_new,
    cb.ending_balance
from customer_base cb
left join new_customers nc on nc.date = cb.date and nc.value_type_id = cb.value_type_id
left join upsell_customers uc on uc.date = cb.date and uc.value_type_id = cb.value_type_id
left join downsell_customers dc on dc.date = cb.date and dc.value_type_id = cb.value_type_id
left join churn_customers chc on chc.date = cb.date and chc.value_type_id = cb.value_type_id
