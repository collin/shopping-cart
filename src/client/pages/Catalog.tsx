import { useEffect, useState } from "react";
import Products from "../../types/store/Products";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import Categories from "../../types/store/Categories";

export const Catalog = () => {
  const [params, setParams] = useSearchParams();
  const pageSize = parseInt(params.get("pageSize") || "10");
  const page = parseInt(params.get("page") || "1");

  const categoryId = params.get("categoryId");

  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${location.origin}/api/products?pageSize=${pageSize}&page=${page}`;
        if (categoryId)
          url += `&categoryId=${categoryId}
        `;
        const response = await fetch(url);
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.log("ERROR FETCHING PRODUCTS");
      }
    };
    fetchProducts();
  }, [pageSize, page, categoryId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${location.origin}/api/categories`);
        const categories = await response.json();
        setCategories(categories);
      } catch (error) {
        console.log("ERROR FETCHING CATEGORIES");
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      Catalogpage
      <ol title="Products">
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ol>
      <ol title="Categories">
        {categories.map((category) => {
          return (
            <li
              key={category.id}
              onClick={() => {
                setParams({
                  pageSize: pageSize.toString(),
                  page: "1",
                  categoryId: category.id.toString(),
                });
              }}
            >
              {category.id === categoryId && "Viewing "} {category.name}
            </li>
          );
        })}
      </ol>
      <button
        onClick={() => {
          setParams({
            pageSize: pageSize.toString(),
            categoryId: categoryId || "",
            page: (page + 1).toString(),
          });
        }}
      >
        Next
      </button>
      {page > 2 && (
        <button
          onClick={() => {
            setParams({
              pageSize: pageSize.toString(),
              categoryId: categoryId || "",
              page: "1",
            });
          }}
        >
          First
        </button>
      )}
      {page > 1 && (
        <button
          onClick={() => {
            setParams({
              pageSize: pageSize.toString(),
              categoryId: categoryId || "",
              page: (page - 1).toString(),
            });
          }}
        >
          Previous
        </button>
      )}
    </div>
  );
};
