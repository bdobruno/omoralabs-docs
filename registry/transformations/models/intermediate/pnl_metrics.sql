{{config(materialised='view')}}

with pnl_rollup as (
    select * from {{ref('pnl_rollup')}}
),

base_and_gross as (
    select
        date,
        3000 as gl_id,
        'gross_margin' as gl_account,
        value_type_id,
        value_type,
        sum(case when gl_id = 1000 then amount else 0 end) - sum(case when gl_id = 2000 then amount else 0 end) as amount
    from pnl_rollup
    group by date, value_type_id, value_type

    UNION ALL

    select
        date,
        7000 as gl_id,
        'total_cost' as gl_account,
        value_type_id,
        value_type,
        sum(case when gl_id = 2000 then amount else 0 end) + sum(case when gl_id = 4000 then amount else 0 end) + sum(case when gl_id = 6000 then amount else 0 end)
    from pnl_rollup
    group by date, value_type_id, value_type
),

base_and_gross_and_contribution as (
    select * from base_and_gross

    UNION ALL

    select
        date,
        5000 as gl_id,
        'contribution_margin' as gl_account,
        value_type_id,
        value_type,
        sum(case when gl_id = 3000 then amount else 0 end) - sum(case when gl_id = 4000 then amount else 0 end) as amount
    from base_and_gross
    group by date, value_type_id, value_type
),

base_ebitda as (
    select * from base_and_gross_and_contribution

    UNION ALL

    select
        date,
        8000 as gl_id,
        'ebitda' as gl_account,
        value_type_id,
        value_type,
        sum(case when gl_id = 5000 then amount else 0 end) - sum(case when gl_id = 6000 then amount else 0 end) as amount
    from base_and_gross_and_contribution
    group by date, value_type_id, value_type
),

-- Combine with pnl_rollup for percentage calculations
combined as (
    select * from pnl_rollup
    UNION ALL
    select * from base_ebitda
)

select * from base_ebitda

UNION ALL

-- Calculate all percentages at the end
select
    date,
    3001 as gl_id,
    'gross_margin_pct' as gl_account,
    value_type_id,
    value_type,
    COALESCE(max(case when gl_id = 3000 then amount end) / nullif(max(case when gl_id = 1000 then amount end), 0), 0) as amount
from combined
group by date, value_type_id, value_type

UNION ALL

select
    date,
    2001 as gl_id,
    'cogs_pct' as gl_account,
    value_type_id,
    value_type,
    COALESCE(max(case when gl_id = 2000 then amount end) / nullif(max(case when gl_id = 1000 then amount end), 0), 0) as amount
from combined
group by date, value_type_id, value_type

UNION ALL

select
    date,
    4001 as gl_id,
    'commercial_costs_pct' as gl_account,
    value_type_id,
    value_type,
    COALESCE(max(case when gl_id = 4000 then amount end) / nullif(max(case when gl_id = 1000 then amount end), 0), 0) as amount
from combined
group by date, value_type_id, value_type

UNION ALL

select
    date,
    6001 as gl_id,
    'fixed_costs_pct' as gl_account,
    value_type_id,
    value_type,
    COALESCE(max(case when gl_id = 6000 then amount end) / nullif(max(case when gl_id = 1000 then amount end), 0), 0) as amount
from combined
group by date, value_type_id, value_type

UNION ALL

select
    date,
    7001 as gl_id,
    'total_cost_pct' as gl_account,
    value_type_id,
    value_type,
    COALESCE(max(case when gl_id = 7000 then amount end) / nullif(max(case when gl_id = 1000 then amount end), 0), 0) as amount
from combined
group by date, value_type_id, value_type

UNION ALL

select
    date,
    5001 as gl_id,
    'contribution_margin_pct' as gl_account,
    value_type_id,
    value_type,
    COALESCE(max(case when gl_id = 5000 then amount end) / nullif(max(case when gl_id = 1000 then amount end), 0), 0) as amount
from combined
group by date, value_type_id, value_type

UNION ALL

select
    date,
    8001 as gl_id,
    'ebitda_pct' as gl_account,
    value_type_id,
    value_type,
    COALESCE(max(case when gl_id = 8000 then amount end) / nullif(max(case when gl_id = 1000 then amount end), 0), 0) as amount
from combined
group by date, value_type_id, value_type

order by value_type_id, date, gl_id
