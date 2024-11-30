export const REGISTERC = (functionId) => `mutation {
  discountAutomaticAppCreate(
    automaticAppDiscount: {
      title: "Combo Discount"
      functionId: "124b9690-da4f-46f1-a887-e94e5aff6278"
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
