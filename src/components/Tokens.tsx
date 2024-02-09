import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMetamask } from "@/context/MetamaskContext";

export function Tokens({ tokens }: any) {
  const { borrow } = useMetamask();

  const onBorrow = async (contractAddress: string, tokenId: number) => {
    await borrow(contractAddress, tokenId);
  };

  return (
    <div className="max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {tokens.map((token: any) => (
          <div key={token.id} className="ml-2 justify-center">
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
                <h3 className="text-lg font-medium text-gray-900">
                  {/* <span aria-hidden="true" className="absolute inset-0" /> */}
                  {token.name}
                </h3>
              </div>
              <div>
                <Button
                  size="sm"
                  variant="default"
                  onClick={async () => {
                    await onBorrow(token.contractAddress, token.id);
                  }}
                >
                  Borrow
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Click borrow to collateralize this NFT</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
