export const GET_PRODUCT_URL = `query ProductBasic($id: ID!) {
    product(id: $id) {
      onlineStoreUrl
      handle
      onlineStorePreviewUrl
    }
  }`