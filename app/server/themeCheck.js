
import { handleGraphQLResponse } from "../utils/sharedUtils";
import { getMainTheme } from "../api/queryMainTheme";
import { getThemeInfo } from "../api/getThemeInfo";
import { authenticate } from "../shopify.server";
import { getShopUrl } from "../api/getShopUrl";

export async function fetchShopUrl(request) {
  const { admin } = await authenticate.admin(request);

  try {
    const shopUrl = await admin.graphql(getShopUrl);
    const shopUrlBody = await handleGraphQLResponse(shopUrl);
    return shopUrlBody;
  } catch (error) {
    console.error("Failed to fetch shop url", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching shop url",
      error: error,
    };
  }
}

export async function fetchMainTheme(request) {
  const { admin } = await authenticate.admin(request);

  try {
    const themes = await admin.graphql(getMainTheme)
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
    const themeContent = await admin.graphql(getThemeInfo, {
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