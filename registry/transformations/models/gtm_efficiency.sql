{{config(materialized='view')}}


with pnl_rollup as (
    select * from {{ ref('pnl_rollup') }}
),

customer_count_view as (
    select * from {{ref('customer_count_view')}}
),

sales_costs as (
    select
        date,
        gl_id,
        gl_account,
        value_type,
        amount
    from pnl_rollup
    where gl_id = 4010
),

mkt_costs as (
    select
        date,
        gl_id,
        gl_account,
        value_type,
        amount
    from pnl_rollup
    where gl_id = 4020
)

select
    sc.date,
    sc.value_type,
    sc.amount as sales_cost,
    mktc.amount as mkt_cost,
    ccv.new_customers,
    sc.amount / ccv.new_customers as sales_cac,
    (sc.amount + mktc.amount) / ccv.new_customers as sales_mkt_cac
from sales_costs sc
left join mkt_costs mktc on sc.date = mktc.date and sc.value_type = mktc.value_type
left join customer_count_view ccv on sc.date = ccv.date and sc.value_type = ccv.value_type
