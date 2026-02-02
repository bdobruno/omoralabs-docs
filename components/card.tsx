import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { cn } from "lib/utils";
import Link from "next/link"

export interface CardSmallProps {
  className?: string;
  cardTitle: string;
  cardText: string;
  buttonText: string;
}

export function CardSmall({
  className,
  cardTitle,
  cardText,
  buttonText,
}: CardSmallProps) {
  return (
    <Link
      href="https://github.com/bdobruno/omoralabs-docs"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
    <Card className={cn("mx-auto w-full max-w-sm border-none cursor-pointer", className)}>
      <CardHeader className="gap-0">
        <CardTitle className=" text-zinc-300 w-full">
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm font-light w-full">
          {cardText}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="default" size="sm" className="font-regular px-5 cursor-pointer">
          {buttonText}
        </Button>
      </CardFooter>
        </Card>
      </div>
    </Link>
  );
}
