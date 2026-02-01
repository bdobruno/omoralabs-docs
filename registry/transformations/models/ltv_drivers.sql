{{config(materialized='view')}}


with ltv as (
    select * from {{ ref('ltv') }}
),

calculated_values as (
    select
        date,
        value_type,
        (arpu - LAG(arpu) OVER (PARTITION BY value_type ORDER BY date)) * LAG(customer_lifetime) OVER (PARTITION BY value_type ORDER BY date) as arpu,
        (customer_lifetime - LAG(customer_lifetime) OVER (PARTITION BY value_type ORDER BY date)) * LAG(arpu) OVER (PARTITION BY value_type ORDER BY date) as customer_lifetime,
        (ltv - LAG(ltv) OVER (PARTITION BY value_type ORDER BY date)) as ltv_delta
    from ltv
)

select *
from calculated_values
where arpu IS NOT NULL
