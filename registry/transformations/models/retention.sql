{{config(materialized='view')}}


with mrr_aggregated as (
    select * from {{ ref('mrr_aggregated') }}
),

customer_count_view as (
    select * from {{ref('customer_count_view')}}
)

select
    mrr.date,
    mrr.value_type,
    (mrr.current_base - mrr.downsell - mrr.churn) / mrr.current_base as gross_revenue_retention,
    (mrr.current_base - mrr.downsell - mrr.churn + mrr.upsell) / mrr.current_base as net_revenue_retention,
    mrr.churn / mrr.current_base as churn_value,
    ccv.churn / ccv.current_base as churn_qty,
    - (ccv.churn / ccv.current_base) + 1 as logo_retention
from mrr_aggregated mrr
left join customer_count_view ccv on ccv.date = mrr.date and ccv.value_type = mrr.value_type
