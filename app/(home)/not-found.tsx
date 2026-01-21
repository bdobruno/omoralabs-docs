import { DocsPage } from "components/layout/notebook/page";
import { OmoraLabsFullLogo } from "components/logo";
import Link from "next/link";

export default function NotFound() {
  return (
    <DocsPage toc={[]} full={false}>
      <div className="flex flex-col items-center justify-center grow px-4">
        <Link href='/'>
          <OmoraLabsFullLogo className="max-w-[200px] h-auto cursor-pointer w-full select-none dark:fill-white" />
        </Link>
        <div className="h-8"></div>
        <hgroup className="text-center">
          <h1 className="font-normal dark:fill-gray-200">Not found</h1>
          <div className="h-3"></div>
          <p className="text-fd-muted-foreground text-sm">
            The page you&apos;re trying to access does not exist.
          </p>
        </hgroup>
      </div>
    </DocsPage>
  );
}
