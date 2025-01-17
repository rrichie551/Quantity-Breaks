import { fetchShopInfo } from "../server/fetchShopInfo.server";
import { sendSlackNotification } from "../server/sendSlackNotification.server";
import {
    checkFirstInstall,
    checkScheduledUninstall,
    createShopInstallation,
    createShopifyStore
} from "../server/shopInstallation.server";
// import { handleGraphQLResponse } from "../utils/sharedUtils";
import db from "../db.server";
import { InstallationEmail } from "./send-mail.server";

export const checkInstall = async ({ admin }) => {
    try {
        const shopData = await fetchShopInfo(admin);
       

        const isFirstInstall = await checkFirstInstall(shopData.data.shop.myshopifyDomain);
       

        const isScheduledUninstall = await checkScheduledUninstall(shopData.data.shop.myshopifyDomain);
        

        if (isScheduledUninstall) {
            try {
                

                // Delete the scheduled uninstallation record
                await db.scheduledUninstall.deleteMany({
                    where: { shop: shopData.data.shop.myshopifyDomain },
                });
                
            } catch (error) {
                console.error(`Error deleting scheduled uninstall record: ${error}`);
            }
        }

        if (isFirstInstall) {
            // Fetch shop data
            if (!shopData || !shopData.data.shop) {
                return {
                    error: "Failed to fetch shop data. Please try again later",
                    status: 500,
                };
            }
            // Create new installation record
            const installation = await createShopInstallation(shopData.data.shop.url, shopData.data.shop.myshopifyDomain);
            

            // Create new store record
            const storeData = await createShopifyStore(shopData.data, installation.id);
            // Send Slack notification

            await sendSlackNotification(storeData);
            await InstallationEmail(shopData.data);
        }

        return {
            success: true,
            message: "Installation check completed successfully",
        };
    } catch (error) {
        console.error("Error in checkInstall:", error);
        return {
            error: "An error occurred during installation check",
            status: 500,
        };
    }
};


// export const registerCartTransform = async ({ admin }) => {
//     try {
//         const query = await admin.graphql(QUERY);
//         const queryResponse = await handleGraphQLResponse(
//             query,
//             "Error fetching function of registerCartTransform",
//         );

//         console.log("This is the queryResponse of registerCartTransform:",
//             JSON.stringify(queryResponse, null, 2)
//         );

//         const functionId = queryResponse.shopifyFunctions?.edges?.find(
//             (edge) => edge?.node?.title === "bundle",
//         )?.node;

//         console.log("This is the functionId of registerCartTransform:", functionId);

//         // Check if functionId exists
//         if (!functionId?.id) {
//             return {
//                 error: "Bundle function not found",
//                 status: 404,
//             };
//         }

//         console.log("This is the functionId.id of registerCartTransform:", functionId.id);

//         const response = await admin.graphql(REGISTER(functionId.id));
//         const jsonResponse = await response.json();

//         console.log("This is the jsonResponse of registerCartTransform:",
//             JSON.stringify(jsonResponse, null, 2)
//         );

//         // Check for userErrors
//         if (jsonResponse.data?.cartTransformCreate?.userErrors?.length > 0) {
//             return {
//                 error: jsonResponse.data.cartTransformCreate.userErrors[0].message,
//                 status: 400,
//             };
//         }

//         // Return success response
//         return {
//             success: true,
//             message: "Cart transform registered successfully",
//             data: jsonResponse.data
//         };

//     } catch (error) {
//         console.error("Error in registerCartTransform:", error);
//         return {
//             errorMessage: "An error occurred during cart transform registration",
//             error: error,
//             status: 500,
//         };
//     }
// }


// export const cartTransform = async ({ admin }) => {
//     try {
//         const cartTransformResponse = await admin.graphql(CART_TRANSFORM);
//         const cartTransformResult = await handleGraphQLResponse(cartTransformResponse, "Error fetching cart transform");
//         console.log("This is the cartTransform check", cartTransformResult);
//         const functionId = cartTransformResult.cartTransforms.edges.find(
//             (edge) => edge?.node?.functionId === "7ed70b57-1f19-407d-8d58-c40dfbcbf48f",
//         )?.node?.functionId;
//         console.log("This is the functionId of cartTransform", functionId);
//         if (!functionId) {
//             return {
//                 success: false,
//                 error: "Cart transform function not found",
//                 status: 404,
//             };
//         }
//         return {
//             success: true,
//             message: "Cart transform fetched successfully",
//         };
//     } catch (error) {
//         console.error("Error in cartTransform:", error);
//         return {
//             errorMessage: "An error occurred during cart transform",
//             error: error,
//             status: 500,
//             success: false,
//         };
//     }
// }


// export const registerWebPixels = async ({ admin }) => {
//     try {
//         const response = await admin.graphql(REGISTER_CART_TRANSFORMATION_PIXEL, {
//             variables: {
//                 settings: JSON.stringify({ accountID: "123" }),
//             },
//         });
//         const { data } = await response.json();
//         console.log("This is the response of registerWebPixels", data);
//     } catch (error) {
//         console.error("Error in registerWebPixels:", error.message);
//         return {
//             errorMessage: "An error occurred during web pixel registration",
//             error: error,
//             status: 500,
//         };
//     }
// }
