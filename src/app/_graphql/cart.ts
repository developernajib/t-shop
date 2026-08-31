import { META } from './meta'

export const CART = `cart {
  items {
    product {
      id
      slug
      priceJSON
      price
      enableVariants
      stock
      variants {
        sku
        title
        size
        color
        price
        stock
      }
      ${META}
    }
    sku
    variantTitle
    quantity
  }
}`
