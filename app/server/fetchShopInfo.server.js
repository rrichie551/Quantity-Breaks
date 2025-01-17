
import { authenticate } from './shopify.server';
import { FETCH_SHOP_INFO } from '../api/FETCH_SHOP_INFO';
import { GET_MAIN_THEME } from '../api/GET_MAIN_THEME';
import { GET_THEME_INFO } from '../api/GET_THEME_INFO';
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

export async function fetchMainTheme(request) {
  const { admin } = await authenticate.admin(request);

  try {
    const themes = await admin.graphql(GET_MAIN_THEME)
    const allthemes = await handleGraphQLResponse(themes, "Failed to fetch Themes")
    return allthemes
  }
  catch (error) {
    console.error("Failed to fetch themes", error)
    return {
      success: false,
      message: error.message || "An error occurred while fetching themes information",
      error: error
    };

  }
}

export async function fetchThemeContent(request, themeId) {
  const { admin } = await authenticate.admin(request);

  try {
    const themeContent = await admin.graphql(GET_THEME_INFO, {
      variables: {
        themeId: themeId
      }
    });
    const themeBody = await handleGraphQLResponse(themeContent);
    return themeBody;

  } catch (error) {
    console.error("Failed to fetch theme content", error)
    return {
      success: false,
      message: error.message || "An error occurred while fetching themes information",
      error: error
    };
  }
}