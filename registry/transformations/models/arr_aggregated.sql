{{config(materialized='view')}}


with mrr_aggregated as (
    select * from {{ ref('mrr_aggregated') }}
)

select
    date,
    value_type,
    current_base * 12 as current_base,
    new_customers * 12 as new_customers,
    upsell * 12 as upsell,
    downsell * 12 as downsell,
    churn * 12 as churn,
    net_new_mrr * 12 as net_new_arr,
    ending_balance * 12 as ending_balance
from mrr_aggregated
