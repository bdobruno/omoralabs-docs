{{config(materialized='view')}}


with gtm_efficiency as (
    select * from {{ ref('gtm_efficiency') }}
),

customer_count_view as (
    select * from {{ref('customer_count_view')}}
),

calculated_values as (
    select
        gtm.date,
        gtm.value_type,
        (gtm.sales_cost - LAG(gtm.sales_cost) OVER (PARTITION BY gtm.value_type ORDER BY gtm.date)) / ccv.new_customers as sales_cost,
        (gtm.mkt_cost - LAG(gtm.mkt_cost) OVER (PARTITION BY gtm.value_type ORDER BY gtm.date)) / ccv.new_customers as mkt_cost,
        -((gtm.sales_cost + gtm.mkt_cost) / LAG(ccv.new_customers) OVER (PARTITION BY ccv.value_type ORDER BY ccv.date) - (gtm.sales_cost + gtm.mkt_cost) / ccv.new_customers) as new_customers,
        (gtm.sales_mkt_cac - LAG(gtm.sales_mkt_cac) OVER (PARTITION BY gtm.value_type ORDER BY gtm.date) ) as cac_delta
    from gtm_efficiency gtm
    left join customer_count_view ccv on gtm.date = ccv.date and gtm.value_type = ccv.value_type
)

select *
from calculated_values
where sales_cost IS NOT NULL
