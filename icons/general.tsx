import Image from "next/image";

export const GitHubLogo = () => (
  <>
    <Image
      src="/github-mark.svg"
      alt="GitHub"
      width={32}
      height={32}
      className="h-4 w-auto dark:hidden"
    />
    <Image
      src="/github-mark-white.svg"
      alt="GitHub"
      width={32}
      height={32}
      className="h-4 w-auto hidden dark:block"
    />
  </>
);

export const NPMLogo = () => (
  <>
    <Image
      src="/npm.svg"
      alt="NPM"
      width={32}
      height={32}
      className="h-4 w-auto dark:hidden"
    />
    <Image
      src="/npm-white.svg"
      alt="NPM"
      width={32}
      height={32}
      className="h-4 w-auto hidden dark:block"
    />
  </>
);

export const DagsterLogo = () => (
  <>
    <Image
      src="/dagster.svg"
      alt="Dagster"
      width={32}
      height={32}
      className="h-14 w-14"
    />
  </>
);

export const DBTLogo = () => (
  <>
    <Image
      src="/dbt.png"
      alt="dbt"
      width={32}
      height={32}
      className="h-8 w-8"
    />
  </>
);

export const DuckDBLogo = () => (
  <span className="inline-flex">
    <Image
      src="/DuckDB_icon-lightmode.svg"
      alt="DuckDB"
      width={32}
      height={32}
      className="h-8 w-8 dark:hidden"
    />
    <Image
      src="/DuckDB_icon-darkmode.svg"
      alt="DuckDB"
      width={32}
      height={32}
      className="h-8 w-8 hidden dark:block"
    />
  </span>
);

export const HexLogo = () => (
  <>
    <Image
      src="/hex.png"
      alt="hex"
      width={32}
      height={32}
      className="h-12 w-12"
    />
  </>
);

export const LookerLogo = () => (
  <>
    <Image
      src="/looker.svg"
      alt="looker"
      width={32}
      height={32}
      className="size-14"
    />
  </>
);

export const PolarsLogo = () => (
  <>
    <Image
      src="/polars_logo_blue.svg"
      alt="polars"
      width={32}
      height={32}
      className="h-8 w-22"
    />
  </>
);
