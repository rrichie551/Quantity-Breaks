import Slack from '@slack/bolt';
import { calculateStoreAge } from '../utils/sharedUtils';
// import { GET_PRODUCT_URL } from '../api/GET_PRODUCT_URL';

const app = new Slack.App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN
});


export async function sendSlackNotification(storeData) {
    try {
        // Calculate store age
        const storeAge = calculateStoreAge(storeData.createdAt);

        await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_NOTIFICATION_CHANNEL,
            text: 'New Shopify Store Installation',
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "New Shopify Store Installation",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Store URL:*\n${storeData.url}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Email:*\n${storeData.email}`
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Contact Email:*\n${storeData.contactEmail || 'Not provided'}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Store Age:*\n${storeAge}`
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Plan:*\n${storeData.planDisplayName}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Myshopify Domain:*\n${storeData.myshopifyDomain}`
                        }
                    ]
                },
                {
                    type: "divider"
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "*Additional Details:*"
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Country:* ${storeData.country || 'Not provided'}\n*Timezone:* ${storeData.ianaTimezone}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Eligible for Bundles:* ${storeData.eligibleForBundles ? 'Yes' : 'No'}\n*Storefront Enabled:* ${storeData.storefront ? 'Yes' : 'No'}`
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Partner Development:* ${storeData.partnerDevelopment ? 'Yes' : 'No'}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Shopify Plus:* ${storeData.shopifyPlus ? 'Yes' : 'No'}`
                        }
                    ]
                }
            ]
        });
    } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError);
    }
}


export async function sendSupportSlackNotification({ email, message, requestType, timestamp, shopDomain }) {
    try {
        return await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_SUPPORT_CHANNEL,
            text: 'New Support Request',
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "New Support Request",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Shop Domain:*\n${shopDomain}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Email:*\n${email}`
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Request Type:*\n${requestType}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Timestamp:*\n${timestamp}`
                        }
                    ]
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Message:*\n${message}`
                    }
                }
            ]
        });

    } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError);
    }


}


export async function sendUninstallNotification(deletedStoreInfo) {
    try {
        await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_NOTIFICATION_CHANNEL,
            text: 'App Uninstalled',
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "Store uninstalled SimpleBundleApp",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Shop Domain:*\n${deletedStoreInfo.shop}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Email:*\n${deletedStoreInfo.email}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Name:*\n${deletedStoreInfo.name}`
                        }

                    ]
                }
            ]
        });

    } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError);
    }


}


export async function sendShopScheduledForUninstallNotification(shopInfo, uninstallDate) {
    try {
        await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.SLACK_NOTIFICATION_CHANNEL,
            text: 'Shop Scheduled for Uninstallation',
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "Shop Scheduled for Uninstallation",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Shop Domain:*\n${shopInfo.shop}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Email:*\n${shopInfo.contactEmail || 'N/A'}`
                        }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Scheduled Uninstall Date:*\n${uninstallDate.toISOString()}`
                        }
                    ]
                }
            ]
        });
    } catch (slackError) {
        console.error('Failed to send Slack notification for scheduled uninstallation:', slackError);
    }
}

// async function getProductUrl(admin, productId) {
//     const response = await admin.graphql(GET_PRODUCT_URL,
//         {
//             variables: {
//                 id: productId
//             }
//         });
//     const productUrl = await handleGraphQLResponse(response);
//     return productUrl;
// }

// export async function sendBundleCreationNotification(bundleData, shopDomain, productId, admin) {
//     const productData = await getProductUrl(admin, productId);

//     const productUrl = productData.product.onlineStoreUrl;
//     const productPreviewUrl = productData.product.onlineStorePreviewUrl;

//     try {
//         await app.client.chat.postMessage({
//             token: process.env.SLACK_BOT_TOKEN,
//             channel: process.env.SLACK_NOTIFICATION_CHANNEL,
//             text: 'New Bundle Created',
//             blocks: [
//                 {
//                     type: "header",
//                     text: {
//                         type: "plain_text",
//                         text: "New Bundle Created",
//                         emoji: true
//                     }
//                 },
//                 {
//                     type: "section",
//                     fields: [
//                         {
//                             type: "mrkdwn",
//                             text: `*Shop Domain:*\n${shopDomain}`
//                         },
//                         {
//                             type: "mrkdwn",
//                             text: `*Bundle Name:*\n${bundleData.bundleName}`
//                         }
//                     ]
//                 },
//                 {
//                     type: "section",
//                     fields: [
//                         {
//                             type: "mrkdwn",
//                             text: `*Bundle Url:*\n${productUrl || "No product url found"}`
//                         },
//                         {
//                             type: "mrkdwn",
//                             text: `*Bundle Preview Url:*\n${productPreviewUrl || "No preview url found"}`
//                         },
//                         {
//                             type: "mrkdwn",
//                             text: `*Bundle Handle:*\n${productData.product.handle}`
//                         }
//                     ]
//                 },
//                 {
//                     type: "section",
//                     fields: [
//                         {
//                             type: "mrkdwn",
//                             text: `*Bundle Type:*\n${bundleData.bundleType}`
//                         },
//                         {
//                             type: "mrkdwn",
//                             text: `*Status:*\n${bundleData.status}`
//                         }
//                     ]
//                 }
//             ]
//         });
//     } catch (slackError) {
//         console.error('Failed to send bundle creation Slack notification:', slackError);
//     }
// }