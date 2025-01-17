import { json } from "@remix-run/node";
import { authenticate } from "../server/shopify.server";
import {
  fetchMainTheme,
  fetchThemeContent,
} from "../server/fetchShopInfo.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  if (!session) {
    return json({
      message: "Unauthorized",
    }, { status: 401 });
  }
  const mainTheme = await fetchMainTheme(request);
  let isEmbed1Enabled = false;
  let isEmbed2Enabled = false;

  if (mainTheme?.themes?.nodes?.length > 0) {
    const themeId = mainTheme.themes.nodes[0].id;
    const themeContent = await fetchThemeContent(request, themeId);

    if (themeContent?.theme?.files?.nodes?.length > 0) {
      try {
        const settingsData = themeContent.theme.files.nodes[0].body.content;
        const cleanSettings = JSON.stringify(settingsData);
        const moreClen = cleanSettings.replace(/\/\*[\s\S]*?\*\//g, "");
        const moreCleann = JSON.parse(moreClen);
        const finalSettings = JSON.parse(moreCleann);

        const bundleOptionFixed = Object.values(
          finalSettings?.current?.blocks ?? {
            disabled: true,
          },
        ).find(
          (block) =>
            block.type.includes("volume-discount") && block.type.includes("c9dd21c1-710d-4b80-b128-2e82d2237ee9"),
        );

        console.log("this is fixed Embed",bundleOptionFixed)

        const bundleOptionInfinite = Object.values(
          finalSettings?.current?.blocks ?? {
            disabled: true,
          },
        ).find(
          (block) =>
            block.type.includes("combo-discount") && block.type.includes("c9dd21c1-710d-4b80-b128-2e82d2237ee9"),
        );
console.log("this is Infinite Embed",bundleOptionInfinite)

        isEmbed1Enabled = bundleOptionFixed?.disabled ? false : true;
        isEmbed2Enabled = bundleOptionInfinite?.disabled ? false : true;

      } catch (error) {
        console.error("Error parsing theme settings:", error);
      }
    }
  }

  return json({
    shop: session.shop,
    isEmbed1Enabled,
    isEmbed2Enabled
  });
};