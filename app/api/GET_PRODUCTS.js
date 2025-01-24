export const GET_PRODUCTS =`#graphql
  query {
    products(first: 1) {
      edges {
        node {
          id
          title
          handle
          priceRangeV2{
            maxVariantPrice{
              amount
            }
          }

        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }`