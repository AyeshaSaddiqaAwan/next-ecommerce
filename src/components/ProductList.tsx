import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const wixClient = await wixClientServer();

  if (!categoryId) {
    console.error("Error: categoryId is missing.");
    return <p className="text-red-500">No category selected.</p>;
  }

  let productQuery = wixClient.products.queryProducts();

  if (searchParams?.name) {
    productQuery = productQuery.startsWith("name", searchParams.name);
  }

  if (categoryId) {
    productQuery = productQuery.eq("collectionIds", categoryId);
  }

  productQuery = productQuery.hasSome(
    "productType",
    searchParams?.type ? [searchParams.type] : ["physical", "digital"]
  );

  if (searchParams?.min !== undefined) {
    productQuery = productQuery.gt("priceData.price", Number(searchParams.min));
  }

  if (searchParams?.max !== undefined) {
    productQuery = productQuery.lt("priceData.price", Number(searchParams.max));
  }

  productQuery = productQuery.limit(limit || PRODUCT_PER_PAGE);

  if (searchParams?.page) {
    const pageNum = parseInt(searchParams.page);
    if (!isNaN(pageNum)) {
      productQuery = productQuery.skip(pageNum * (limit || PRODUCT_PER_PAGE));
    }
  }

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");
    if (sortType === "asc") productQuery = productQuery.ascending(sortBy);
    if (sortType === "desc") productQuery = productQuery.descending(sortBy);
  }

  try {
    const res = await productQuery.find();

    return (
      <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
        {res.items.length > 0 ? (
          res.items.map((product: products.Product) => (
            <Link
              href={"/" + product.slug}
              className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
              key={product._id}
            >
              <div className="relative w-full h-80">
                <Image
                  src={product.media?.mainMedia?.image?.url || "/product.png"}
                  alt={product.name || "Product"}
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
                />
                {product.media?.items?.length && product.media.items.length > 1 && (
                  <Image
                    src={product.media.items[1]?.image?.url || "/product.png"}
                    alt={product.name || "Product"}
                    fill
                    sizes="25vw"
                    className="absolute object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{product.name}</span>
                <span className="font-semibold">
                  ${product.price?.price || "N/A"}
                </span>
              </div>
              {product.additionalInfoSections && (
                <div
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      product.additionalInfoSections.find(
                        (section: any) => section.title === "shortDesc"
                      )?.description || ""
                    ),
                  }}
                ></div>
              )}
              <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
                Add to Cart
              </button>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}

        {searchParams?.cat || searchParams?.name ? (
          <Pagination
            currentPage={res.currentPage || 0}
            hasPrev={res.hasPrev()}
            hasNext={res.hasNext()}
          />
        ) : null}
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return <p className="text-red-500">Failed to load products.</p>;
  }
};

export default ProductList;
