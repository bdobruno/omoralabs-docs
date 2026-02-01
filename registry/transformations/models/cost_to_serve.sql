{{config(materialized='view')}}


with pnl_rollup as (
    select * from {{ ref('pnl_rollup') }}
),

customer_count_view as (
    select * from {{ref('customer_count_view')}}
),

customer_support_costs as (
    select
        date,
        gl_id,
        gl_account,
        value_type,
        amount
    from pnl_rollup
    where gl_id = 4030
)

select
    css.date,
    css.value_type,
    css.amount as customer_support_cost,
    ccv.ending_balance as nr_of_customers,
    COALESCE(css.amount / ccv.ending_balance,0) as cost_to_serve
from customer_support_costs css
left join customer_count_view ccv on css.date = ccv.date and css.value_type = ccv.value_type
