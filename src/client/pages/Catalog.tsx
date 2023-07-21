import { useEffect, useState } from "react";
import Products from "../../types/store/Products";

export const Catalog = () => {
  const [products, setProducts] = useState<Products[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${location.origin}/api/products`);
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.log("ERROR FETCHING PRODUCTS");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      Catalogpage
      <ol>
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ol>
    </div>
  );
};
