export const DISCOUNT_NODES = `
 query {
  automaticDiscountNodes(first: 50,query:"type:app") {
    edges {
      node {
        id
        automaticDiscount {
          ... on DiscountAutomaticApp{
            title
            asyncUsageCount
            status
            discountClass
            appDiscountType{
              app{
                handle
              }
            }
            

          }
        }
      }
    }
  }
}
`