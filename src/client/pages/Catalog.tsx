import { useEffect, useState } from "react";
import Products from "../../types/store/Products";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

export const Catalog = () => {
  const [params, setParams] = useSearchParams();
  const pageSize = parseInt(params.get("pageSize") || "10");
  const page = parseInt(params.get("page") || "1");
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${location.origin}/api/products?pageSize=${pageSize}&page=${page}`,
        );
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.log("ERROR FETCHING PRODUCTS");
      }
    };
    fetchProducts();
  }, [pageSize, page]);

  return (
    <div>
      Catalogpage
      <ol>
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ol>
      <button
        onClick={() => {
          setParams({
            pageSize: pageSize.toString(),
            page: (page + 1).toString(),
          });
        }}
      >
        Next
      </button>
      <button
        onClick={() => {
          setParams({
            pageSize: pageSize.toString(),
            page: (page - 1).toString(),
          });
        }}
      >
        Previous
      </button>
    </div>
  );
};
