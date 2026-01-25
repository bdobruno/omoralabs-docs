import fs from "fs";
import { source } from "lib/source";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);

  if (!page) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const relativePath = `${resolvedParams.slug?.join("/") || "index"}.mdx`;
    const filePath = path.join(process.cwd(), "content/docs", relativePath);
    const content = fs.readFileSync(filePath, "utf-8");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Error reading file", { status: 500 });
  }
}
