{{config(materialized='view')}}

WITH RECURSIVE pnl as (
    select * from {{ref('pnl_source')}}
),

gl_accounts as (
    select * from {{ref('gl_accounts_source')}}
),

pnl_rollup as (
    select
        date,
        gl_account_id,
        value_type_id,
        amount,
        0 as level
    from pnl

    union all

    select
        pr.date,
        ga.parent_gl as gl_account_id,
        pr.value_type_id,
        pr.amount,
        pr.level + 1
    from pnl_rollup pr
    join gl_accounts ga on ga.id = pr.gl_account_id
    join gl_accounts parent_ga on parent_ga.id = ga.parent_gl
    where ga.parent_gl is not null
)

select
    p.date,
    ga.id as gl_id,
    ga.name as gl_account,
    pnlr.value_type_id,
    vt.name as type,
    SUM(pnlr.amount) as amount
from pnl_rollup pnlr
join dates p ON p.date = pnlr.date
join gl_accounts ga ON ga.id = pnlr.gl_account_id
join value_types vt ON vt.id = pnlr.value_type_id
group by p.date, ga.id, ga.name, pnlr.value_type_id, vt.name
order by value_type_id, p.date, gl_id
