// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ProductsId } from './Products';
import type { CategoriesId } from './Categories';

/** Represents the table store.products_categories */
export default interface ProductsCategories {
  product_id: ProductsId;

  category_id: CategoriesId;
}

/** Represents the initializer for the table store.products_categories */
export interface ProductsCategoriesInitializer {
  product_id: ProductsId;

  category_id: CategoriesId;
}

/** Represents the mutator for the table store.products_categories */
export interface ProductsCategoriesMutator {
  product_id?: ProductsId;

  category_id?: CategoriesId;
}
