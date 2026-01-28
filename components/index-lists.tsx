import { source } from "lib/source";
import Link from "next/link";

type ListItem = {
  url: string;
  data: {
    title: string;
  };
};

function getIndexList(location: string) {
  const list = source
    .getPages()
    .filter(
      (p) => p.url.startsWith(`/${location}/`) && p.url !== `/${location}`,
    )
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  return list;
}

function IndexList({ list }: { list: ListItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20 mt-8">
      {list.map((t) => (
        <Link
          key={t.url}
          href={t.url}
          className="no-underline inline-flex items-center gap-2 text-lg font-light underline-offset-4 hover:underline md:text-base"
        >
          {t.data.title}
        </Link>
      ))}
    </div>
  );
}

export function TransformationsList() {
  const list = getIndexList("transformations");
  return <IndexList list={list} />;
}

export function FactsList() {
  const list = getIndexList("facts");
  return <IndexList list={list} />;
}

export function SemanticsList() {
  const list = getIndexList("semantic-layers");
  return <IndexList list={list} />;
}

export function BlueprintsList() {
  const list = getIndexList("blueprints");
  return <IndexList list={list} />;
}

export function WorkersList() {
  const list = getIndexList("workers");
  return <IndexList list={list} />;
}
