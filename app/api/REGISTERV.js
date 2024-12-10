export const REGISTERV = (functionId) => `mutation {
    discountAutomaticAppCreate(
      automaticAppDiscount: {
        title: "Volume Discount"
        functionId: "${functionId}"
        startsAt: "2022-06-22T00:00:00"
      }
    ) {
      automaticAppDiscount {
        discountId
      }
      userErrors {
        field
        message
      }
    }
  }
  `;
  