export const REGISTERV = (functionId) => `mutation {
    discountAutomaticAppCreate(
      automaticAppDiscount: {
        title: "Volume Discount"
        functionId: "809026b0-0b70-43d6-a318-b95222d5486e"
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
  