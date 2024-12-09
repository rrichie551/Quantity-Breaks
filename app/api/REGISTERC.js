export const REGISTERC = (functionId) => `mutation {
  discountAutomaticAppCreate(
    automaticAppDiscount: {
      title: "Combo Discount"
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
