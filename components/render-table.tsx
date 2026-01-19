import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";

export default function RenderTable({
  data,
  caption,
}: {
  data: Record<string, any>[];
  caption?: string;
}) {
  const columns = Object.keys(data[0]);

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          {columns.map((c) => (
            <TableHead className="w-[100px]" key={c}>
              {c}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {columns.map((c) => (
              <TableCell className="font-medium" key={c}>
                {row[c]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
