import prisma from "../server/db.server";

export async function checkFirstInstall(shop) {
    try {
        const installation = await prisma.shopInstallation.findUnique({
            where: { myshopifyDomain: shop },
        }); 

        return !installation;

    } catch (error) {
        console.error("Error checking first install", error);
    }

}

export async function checkScheduledUninstall(shop) {
    try {
        const shopInfo = await prisma.scheduledUninstall.findFirst({
            where: { shop },
        });

        return shopInfo;

    } catch (error) {
        console.error("Error checking scheduled uninstall", error);
    }

}


export async function createShopInstallation(shop, myshopifyDomain) {
    try {
        return prisma.shopInstallation.create({
            data: { shop: shop, myshopifyDomain: myshopifyDomain },
        });

    } catch (error) {
        console.error("Error creating shop installation", error);
    }

}

export async function createShopifyStore(storeData, shopInstallationId) {

    try {
        const { shop } = storeData;

        return prisma.shopifyStore.create({
            data: {
                shopInstallation: {
                    connect: { id: shopInstallationId }
                },
                name: shop.name,
                myshopifyDomain: shop.myshopifyDomain,
                url: shop.url,
                eligibleForBundles: shop.features.bundles.eligibleForBundles,
                storefront: shop.features.storefront,
                currencyCode: shop.currencyCode,
                planDisplayName: shop.plan.displayName,
                partnerDevelopment: shop.plan.partnerDevelopment,
                shopifyPlus: shop.plan.shopifyPlus,
                createdAt: new Date(shop.createdAt),
                updatedAt: new Date(shop.updatedAt),
                contactEmail: shop.contactEmail,
                email: shop.email,
                description: shop.description,
                ianaTimezone: shop.ianaTimezone,
                primaryDomainId: shop.primaryDomain.id,
                country: shop.billingAddress.country,
            },
        });

    } catch (error) {
        console.error("Error creating shopify store", error);
    }

}

export async function getShopifyStore(myshopifyDomain) {
    try {
        return prisma.shopifyStore.findUnique({
            where: { myshopifyDomain },
        });

    } catch (error) {
        console.error("Error getting shopify store", error);
    }

}