import { CodeBlock, Pre } from "components/codeblock";
import GLAccountsSelector from "components/gl_accounts_segmented";
import RenderTable from "components/render-table";
import { TypeTable } from "components/type-table";
import { TypeTableFromFile } from "components/type-table-from-file";
import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";
import { Banner } from "fumadocs-ui/components/banner";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { cn } from "lib/utils";
import {
  ArrowLeftRight,
  Box,
  ClipboardList,
  Compass,
  Cpu,
  Diff,
  GraduationCap,
  Layers,
  Play,
  Shuffle,
  Table2,
  Wallet,
  Zap,
} from "lucide-react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { File, Files, Folder } from "fumadocs-ui/components/files";

import ReadComponents from "components/read-components";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ...components,
    h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
      <h1
        className={cn(
          "font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight  dark:text-gray-300",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.ComponentProps<"h2">) => {
      return (
        <h2
          id={props.children
            ?.toString()
            .replace(/ /g, "-")
            .replace(/'/g, "")
            .replace(/\?/g, "")
            .toLowerCase()}
          className={cn(
            "font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4  dark:text-gray-300",
            className,
          )}
          {...props}
        />
      );
    },
    h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "font-heading mt-12 scroll-m-28 text-lg font-medium tracking-tight [&+p]:!mt-4 *:[code]:text-xl  dark:text-gray-300",
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
      <h4
        className={cn(
          "font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight  dark:text-gray-300",
          className,
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
      <h5
        className={cn(
          "mt-8 scroll-m-28 text-base font-medium tracking-tight  dark:text-gray-300",
          className,
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
      <h6
        className={cn(
          "mt-8 scroll-m-28 text-base font-medium tracking-tight  dark:text-gray-300",
          className,
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }: React.ComponentProps<"a">) => (
      <a
        className={cn(
          "underline underline-offset-4  dark:text-gray-300 font-light",
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.ComponentProps<"p">) => (
      <p
        className={cn(
          "leading-relaxed [&:not(:first-child)]:mt-6 dark:text-gray-300 font-light break-words",
          className,
        )}
        {...props}
      />
    ),
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className={cn("font-medium", className)} {...props} />
    ),
    ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
      <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
      <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }: React.ComponentProps<"li">) => (
      <li
        className={cn("mt-2  dark:text-gray-300 font-light", className)}
        {...props}
      />
    ),
    table: ({ className, ...props }: React.ComponentProps<"table">) => (
      <table className={cn("w-full text-sm", className)} {...props} />
    ),
    th: ({ className, ...props }: React.ComponentProps<"th">) => (
      <th className={cn("font-medium text-left p-2", className)} {...props} />
    ),
    td: ({ className, ...props }: React.ComponentProps<"td">) => (
      <td className={cn("font-light p-2", className)} {...props} />
    ),
    blockquote: ({
      className,
      ...props
    }: React.ComponentProps<"blockquote">) => (
      <blockquote
        className={cn("mt-6 border-l-2 pl-6 italic", className)}
        {...props}
      />
    ),
    img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
      <img className={cn("rounded-md", className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }: React.ComponentProps<"hr">) => (
      <hr className="my-4 md:my-8" {...props} />
    ),
    pre: ({ ref: _ref, ...props }) => {
      return (
        <CodeBlock
          {...props}
          data-line-numbers={props.className?.includes("lineNumbers")}
          className="dark:bg-zinc-700/30 bg-zinc-200/30 leading-[1.9]! relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none max-h-85 overflow-auto scrollbar-hide"
        >
          <Pre>{props.children}</Pre>
        </CodeBlock>
      );
    },
    figure: ({ className, ...props }: React.ComponentProps<"figure">) => {
      return <figure className={cn(className)} {...props} />;
    },
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight",
          className,
        )}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div
        className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0"
        {...props}
      />
    ),
    Tab: ({ className, ...props }: React.ComponentProps<"div">) => (
      <div className={cn(className)} {...props} />
    ),
    Banner: (props) => <Banner changeLayout={false} {...props} />,
    Wallet,
    Diff,
    ArrowLeftRight,
    Play,
    Compass,
    Zap,
    GraduationCap,
    Layers,
    Box,
    RenderTable,
    CodeBlock,
    ReadComponents,
    GLAccountsSelector,
    File,
    Folder,
    Files,
    TypeTable,
    TypeTableFromFile,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    Table2,
    Shuffle,
    Cpu,
    ClipboardList,
    LinkedCard: ({
      className,
      ...props
    }: React.ComponentProps<typeof Link>) => (
      <Link
        className={cn(
          "bg-zinc-700/10 dark:bg-zinc-700/30 text-surface-foreground dark:hover:bg-zinc-700/30 flex w-full flex-col items-center rounded-xl p-6 transition-colors sm:p-10 no-underline dark:text-gray-300",
          className,
        )}
        {...props}
      />
    ),
    Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
      <Link
        className={cn(
          "font-medium underline underline-offset-4  dark:text-gray-300 decoration-text-gray-300",
          className,
        )}
        {...props}
      />
    ),
  };
}
