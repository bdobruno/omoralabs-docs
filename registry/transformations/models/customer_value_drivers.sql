{{config(materialized='view')}}


with customer_value as (
    select * from {{ ref('customer_value') }}
),

customer_count_view as (
    select * from {{ref('customer_count_view')}}
),

calculated_values as (
    select
        cv.date,
        cv.value_type,
        (cv.current_base - LAG(cv.total_customer_value) OVER (PARTITION BY cv.value_type ORDER BY cv.date)) * (ccv.current_base / ccv.ending_balance) as current_base,
        (cv.new_customers - LAG(cv.total_customer_value) OVER (PARTITION BY cv.value_type ORDER BY cv.date)) * (ccv.new_customers / ccv.ending_balance) as new_customers,
        -(cv.churn - LAG(cv.total_customer_value) OVER (PARTITION BY cv.value_type ORDER BY cv.date)) * (ccv.churn / ccv.ending_balance) as churn,
        (cv.total_customer_value - LAG(cv.total_customer_value) OVER (PARTITION BY cv.value_type ORDER BY cv.date) ) as customer_value_delta
    from customer_value cv
    left join customer_count_view ccv on cv.date = ccv.date and cv.value_type = ccv.value_type
)

select *
from calculated_values
where current_base IS NOT NULL
