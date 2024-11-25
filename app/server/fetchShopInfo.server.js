
import { authenticate } from '../shopify.server';
import { FETCH_SHOP_INFO } from '../api/FETCH_SHOP_INFO';
import { handleGraphQLResponse } from '../utils/sharedUtils';

export async function fetchShopInfo(request) {
  const { admin } = await authenticate.admin(request);

  try {
    const shopResponse = await admin.graphql(FETCH_SHOP_INFO);
    const shopDetails = await handleGraphQLResponse(shopResponse, "Error fetching shop information");
  
    return {
      success: true,
      message: "Shop information fetched successfully",
      data: shopDetails
    };
  } catch (error) {
    console.error("Error fetching shop information:", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching shop information",
      error: error
    };
  }
}