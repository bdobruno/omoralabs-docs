{{config(materialized='view')}}


with customer_count as (
    select * from {{ ref('customer_count') }}
),

changes as (
    select * from {{ref('revenue_changes')}}
),

value_types as (
    select * from {{ref('value_types')}}
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
    cc.date,
    vt.name as value_type,
    cc.current_base,
    nc.nr_of_customers as new_customers,
    uc.nr_of_customers as upsell,
    dc.nr_of_customers as downsell,
    chc.nr_of_customers as churn,
    cc.net_new,
    cc.ending_balance
from customer_count cc
left join new_customers nc on nc.date = cc.date and nc.value_type_id = cc.value_type_id
left join upsell_customers uc on uc.date = cc.date and uc.value_type_id = cc.value_type_id
left join downsell_customers dc on dc.date = cc.date and dc.value_type_id = cc.value_type_id
left join churn_customers chc on chc.date = cc.date and chc.value_type_id = cc.value_type_id
left join value_types vt on vt.id = cc.value_type_id
