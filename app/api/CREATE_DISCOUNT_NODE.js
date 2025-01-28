export const CREATE_DISCOUNT_NODE = `#graphql
          mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
            discountCreate: discountAutomaticAppCreate(automaticAppDiscount: $discount) {
              automaticAppDiscount {
                discountId
              }
              userErrors {
                code
                message
                field
              }
            }
          }`