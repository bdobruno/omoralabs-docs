import { DocsPage } from "components/layout/notebook/page";
import { PageDataSetter } from "components/layout/page-data-setter";

import { NavigationBottom } from "components/nav-bottom";
import { findNeighbour } from "fumadocs-core/page-tree";
import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getPageImage, source } from "lib/source";
import { getMDXComponents } from "mdx-components";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const neighbours = findNeighbour(source.pageTree, page.url);

  const MDX = page.data.body;
  const gitConfig = {
    user: "omoralabs",
    repo: "omora-labs-docs",
    branch: "main",
  };

  const slugPath = params.slug?.join("/") || "index";
  const markdownUrl = `/api/mdx/${slugPath}`;
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${slugPath}.mdx`;

  return (
    <>
      <PageDataSetter markdownUrl={markdownUrl} githubUrl={githubUrl} />
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        tableOfContent={{ style: "clerk" }}
        tableOfContentPopover={{ enabled: false }}
      >
        <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl dark:text-gray-300">
          {page.data.title}
        </h1>
        <p className="text-muted-foreground text-[1.05rem] sm:text-base font-light">
          {page.data.description}
        </p>
        <div className="py-8">
          <DocsBody>
            <MDX
              components={getMDXComponents({
                a: createRelativeLink(source, page),
              })}
            />
          </DocsBody>
        </div>
        <NavigationBottom neighbours={neighbours} />
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const isHomePage = !params.slug || params.slug.length === 0;

  return {
    title: isHomePage ? "Omora Docs" : `${page.data.title} | Omora Docs`,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
