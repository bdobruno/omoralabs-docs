{{config(materialized='view')}}


with pnl_metrics as (
    select * from {{ ref('pnl_metrics') }}
),

customer_count_view as (
    select * from {{ref('customer_count_view')}}
),

gtm_efficiency as (
    select * from {{ref('gtm_efficiency')}}
),

retention as (
    select * from {{ref('retention')}}
),

gross_margin as (
    select
        date,
        gl_id,
        gl_account,
        value_type,
        amount
    from pnl_metrics
    where gl_id = 3000
),

arpu as (
    select
        gm.date,
        gm.value_type,
        gm.amount / ccv.current_base as arpu
    from gross_margin gm
    left join customer_count_view ccv on gm.date = ccv.date and gm.value_type = ccv.value_type
),

arpu_cac as (
    select
        arpu.date,
        arpu.value_type,
        COALESCE(arpu.arpu / gtm.sales_mkt_cac,0) as arpu_cac_ratio
    from arpu
    left join gtm_efficiency gtm on arpu.date = gtm.date and arpu.value_type = gtm.value_type
),

payback as (
    select
        apc.date,
        apc.value_type,
        COALESCE(1 / apc.arpu_cac_ratio,0) as payback
    from arpu_cac apc
),

customer_lifetime as (
    select
        r.date,
        r.value_type,
        COALESCE (1 / r.churn_qty) as customer_lifetime
    from retention r
),

ltv as (
   select
        arpu.date,
        arpu.value_type,
        arpu.arpu * clt.customer_lifetime as ltv
    from arpu
    left join customer_lifetime clt on arpu.date = clt.date and arpu.value_type = clt.value_type
)

select
    arpu.date,
    arpu.value_type,
    arpu.arpu,
    apc.arpu_cac_ratio,
    pb.payback,
    clt.customer_lifetime,
    ltv.ltv,
    COALESCE( ltv.ltv / gtm.sales_mkt_cac, 0) as ltv_to_cac_ratio
from arpu
left join arpu_cac apc on arpu.date = apc.date and arpu.value_type = apc.value_type
left join gtm_efficiency gtm on arpu.date = gtm.date and arpu.value_type = gtm.value_type
left join payback pb on arpu.date = pb.date and arpu.value_type = pb.value_type
left join customer_lifetime clt on arpu.date = clt.date and arpu.value_type = clt.value_type
left join ltv on arpu.date = ltv.date and arpu.value_type = ltv.value_type
