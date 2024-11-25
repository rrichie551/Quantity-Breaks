export const FETCH_SHOP_INFO = `
query getShop {
  shop {
    name
    myshopifyDomain
    url
    features{
      bundles{
        eligibleForBundles
      }
    }
    currencyCode
    currencyFormats{
        moneyFormat
        moneyInEmailsFormat
        moneyWithCurrencyFormat
        moneyWithCurrencyInEmailsFormat
    }
    plan{
     displayName
      partnerDevelopment
      shopifyPlus
    }
    billingAddress{
    country
    }
    createdAt
    contactEmail
    email
    description
    features{
    bundles{
      ineligibilityReason
    }
    storefront
    }
    ianaTimezone
    primaryDomain {
      id
    }
    updatedAt

  }
}
`;