import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Tokens({ tokens }: any) {
  return tokens.map((token: any) => (
    <div key={token.name} className="token ml-2">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          src={token.image}
          alt={token.name}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          width={500}
          height={500}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <Link href={`/dashboard/memory/${token.token_id}`}>
            <h3 className="text-lg font-medium text-gray-900">
              <span aria-hidden="true" className="absolute inset-0" />
              {token.name}
            </h3>
          </Link>
        </div>
        <p className="text-sm font-medium text-gray-900">
          <Button size="sm">Lend</Button>
        </p>
      </div>
    </div>
  ));
}
