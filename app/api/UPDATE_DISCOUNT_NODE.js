export const UPDATE_DISCOUNT_NODE =  `#graphql
        mutation discountAutomaticAppUpdate($automaticAppDiscount: DiscountAutomaticAppInput!, $id: ID!) {
          discountAutomaticAppUpdate(automaticAppDiscount: $automaticAppDiscount, id: $id) {
            automaticAppDiscount {
              discountId
              title
              startsAt
              endsAt
              status
              appDiscountType {
                appKey
                functionId
              }
              combinesWith {
                orderDiscounts
                productDiscounts
                shippingDiscounts
              }
            }
            userErrors {
              field
              message
            }
          }
        }`