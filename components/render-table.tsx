import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";

import { parse } from "csv-parse/sync";
import fs from "fs";

export default function RenderTable({
  csvPath,
  caption,
  children,
}: {
  csvPath: string;
  caption?: string;
  children: React.ReactNode;
}) {
  const csv = fs.readFileSync(csvPath, "utf-8");
  const records = parse(csv, { columns: true }) as Record<
    string,
    string | number | null
  >[];
  const columns = Object.keys(records[0]);

  return (
    <div className="flex flex-col gap-0 select-none">
      <div className="flex bg-transparent justify-center w-full p-8 border rounded-t-lg max-h-[400px]">
        <Table className="rounded-none border-none overflow-auto">
          <TableCaption className="pt-10">{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead
                  className="w-[100px]  bg-zinc-100 dark:bg-zinc-900 sticky top-0"
                  key={c}
                >
                  {c}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((row, i) => (
              <TableRow key={i}>
                {columns.map((c) => (
                  <TableCell className="font-light text-sm" key={c}>
                    {row[c]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="dark:bg-zinc-700/30 [&>figure]:bg-transparent! bg-zinc-200/30 [&>figure]:my-0 overflow-auto max-h-75 [&>figure]:border-none! border rounded-b-lg scrollbar-hide [&_div[role=region]]:overflow-visible [&_div[role=region]]:max-h-none">
        {children}
      </div>
    </div>
  );
}
