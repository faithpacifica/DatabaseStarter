import Stars from "../Stars";
import { Card, CardContent } from "../../ui/card";
// import the type from the Prisma client

// If Review is a model in your Prisma schema, use:
import type { Review } from "@prisma/client";

// If not, define your own type:
// type Review = {
//   id: string;
//   name: string;
//   rating: number;
//   content: string;
// };

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Review({ review }: { review: Review }) {
  // grab the initials from the name
  const initials = review.name
    .split(" ")
    .map((n: any[]) => n[0])
    .join("");

  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage alt="@jaredpalmer" src="/placeholder-avatar.jpg" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{review.name}</h3>
            <div className="flex items-center gap-0.5">
              <Stars rating={review.rating} />
            </div>
          </div>
        </div>
        <p>{review.content}</p>
      </CardContent>
    </Card>
  );
}
