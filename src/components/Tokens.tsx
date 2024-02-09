import { View } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Tokens({ assets }: any) {
  console.log(assets);
  return (
    <div className="max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {assets.map((asset: any) => (
          <div key={asset.id} className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
              <Image
                src={asset.image_url}
                alt={asset.name}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                width={500}
                height={500}
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <Link href={`/dashboard/memory/${asset.token_id}`}>
                  <h3 className="text-lg font-medium text-gray-900">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {asset.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-gray-500">
                  {new Intl.DateTimeFormat("en-Gb", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(asset.created_at))}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                <View color="grey" />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
