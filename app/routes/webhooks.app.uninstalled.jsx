import { authenticate } from "../server/shopify.server";
import prisma from "../db.server";
import { sendUninstallNotification } from "../server/sendSlackNotification.server";

// Track processed webhook IDs to prevent duplicates
const processedWebhooks = new Set();

export const action = async ({ request }) => {
  const { shop, webhookId } = await authenticate.webhook(request);

  // Check if this webhook was already processed
  if (processedWebhooks.has(webhookId)) {
    console.log(`Skipping duplicate webhook ${webhookId} for ${shop}`);
    return new Response(null, { status: 200 });
  }
  console.log(`Received APP_UNINSTALLED webhook for ${shop}`);

  try {
    // Get shop information from database
    const shopInfo = await prisma.shopInstallation.findUnique({
      where: {
        myshopifyDomain: shop,
      },
    });

    if (!shopInfo) {
      console.error(`Shop information not found for ${shop}`);
      return new Response(null, { status: 200 });
    }

    sendUninstallNotification(shopInfo);
    // Trigger the email sequence task


    // Mark webhook as processed
    processedWebhooks.add(webhookId);

    // Cleanup old webhook IDs
    setTimeout(
      () => {
        processedWebhooks.delete(webhookId);
      },
      24 * 60 * 60 * 1000,
    );

    console.log(`Successfully processed uninstall webhook for ${shop}`);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(`Error processing uninstall webhook for ${shop}:`, error);
    return new Response(null, { status: 500 });
  }
};