{{config(materialized='ephemeral')}}

select * from {{ ref('pnl_rollup') }}
UNION ALL
select * from {{ ref('pnl_metrics') }}
