import { DocsPage } from "components/layout/notebook/page";
import { PageDataSetter } from "components/layout/page-data-setter";
import { NavigationBottom } from "components/nav-bottom";
import { findNeighbour } from "fumadocs-core/page-tree";
import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getPageImage, source } from "lib/source";
import { getMDXComponents } from "mdx-components";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const neighbours = findNeighbour(source.pageTree, page.url);

  const MDX = page.data.body;
  const gitConfig = {
    user: "omoralabs",
    repo: "omoralabs-docs",
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
        tableOfContent={{ style: "clerk", enabled: true }}
        tableOfContentPopover={{ enabled: false }}
        breadcrumb={{enabled: false}}
      >
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-300 w-full">
          {page.data.title}
        </h1>
        <p className="text-muted-foreground text-base sm:text-[1.05rem] font-light">
          {page.data.description}
        </p>
        <div className="py-8 w-full">
          <DocsBody>
            <MDX
              components={getMDXComponents({
                a: createRelativeLink(source, page),
              })}
            />
          </DocsBody>
        </div>
        <NavigationBottom neighbours={neighbours} />
        <footer className="text-center text-muted-foreground text-xs font-light sm:text-sm">
          <p>
            Built by{" "}
            <Link
              href="https://www.linkedin.com/in/bdobruno/"
              className="underline underline-offset-4 hover:text-foreground"
            >
              bdobruno
            </Link>{" "}
            at{" "}
            <Link
              href="https://www.omoralabs.com"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Omora Labs
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/omoralabs/omoralabs-docs"
              className="underline underline-offset-4 hover:text-foreground"
            >
              GitHub
            </Link>
            .
          </p>
        </footer>
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
