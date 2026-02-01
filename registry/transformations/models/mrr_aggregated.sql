{{config(materialized='view')}}


with mrr_view as (
    select * from {{ ref('mrr_view') }}
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
        total_mrr
    from changes
    where revenue_type_id = 1
),

upsell_customers as (
    select
        date,
        value_type_id,
        total_mrr
    from changes
    where revenue_type_id = 2
),

downsell_customers as (
    select
        date,
        value_type_id,
        total_mrr
    from changes
    where revenue_type_id = 3
),

churn_customers as (
    select
        date,
        value_type_id,
        total_mrr
    from changes
    where revenue_type_id = 4
)

select
    mrr.date,
    vt.name as value_type,
    mrr.current_base,
    nc.total_mrr as new_customers,
    uc.total_mrr as upsell,
    dc.total_mrr as downsell,
    chc.total_mrr as churn,
    mrr.net_new_mrr,
    mrr.ending_balance
from mrr_view mrr
left join new_customers nc on nc.date = mrr.date and nc.value_type_id = mrr.value_type_id
left join upsell_customers uc on uc.date = mrr.date and uc.value_type_id = mrr.value_type_id
left join downsell_customers dc on dc.date = mrr.date and dc.value_type_id = mrr.value_type_id
left join churn_customers chc on chc.date = mrr.date and chc.value_type_id = mrr.value_type_id
left join value_types vt on vt.id = mrr.value_type_id
