import { DocsPage } from "components/layout/notebook/page";
import { PageDataSetter } from "components/layout/page-data-setter";
import { Button } from "components/ui/button";
import { findNeighbour } from "fumadocs-core/page-tree";
import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getPageImage, source } from "lib/source";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getMDXComponents } from "mdx-components";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const gitConfig = {
    user: "omoralabs",
    repo: "omora-labs-docs",
    branch: "main",
  };

  const slugPath = params.slug?.join("/") || "index";
  const markdownUrl = `/api/mdx/${slugPath}`;
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${slugPath}.mdx`;
  const neighbours = findNeighbour(source.pageTree, page.url);

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
        <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
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
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between gap-2 px-4 md:px-0">
          {neighbours.previous && (
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="shadow-none"
            >
              <Link
                href={neighbours.previous.url}
                className="flex gap-1 dark:text-gray-300 text-extralight"
              >
                <ArrowLeft />
                <span className="hidden min-[400px]:inline">
                  {" "}
                  {neighbours.previous.name}
                </span>
              </Link>
            </Button>
          )}
          {neighbours.next && (
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto shadow-none"
              asChild
            >
              <Link
                href={neighbours.next.url}
                className="flex gap-1 dark:text-gray-300 text-extralight"
              >
                <span className="hidden min-[400px]:inline">
                  {" "}
                  {neighbours.next.name}
                </span>
                <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
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
