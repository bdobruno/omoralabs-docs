{{config(materialized='view')}}


with arr_aggregated as (
    select * from {{ ref('arr_aggregated') }}
),

customer_count_view as (
    select * from {{ref('customer_count_view')}}
),

customer_values as (
    select
        date,
        value_type,
        current_base + upsell - downsell as arr_base,
        new_customers,
        churn,
        ending_balance
    from arr_aggregated
)

select
    cv.date,
    cv.value_type,
    cv.arr_base / ccv.current_base as current_base,
    cv.new_customers / ccv.new_customers as new_customers,
    cv.churn / ccv.churn as churn,
    cv.ending_balance / ccv.ending_balance as total_customer_value
from customer_values cv
left join customer_count_view ccv on cv.date = ccv.date and cv.value_type = ccv.value_type
