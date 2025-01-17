-- CreateTable
CREATE TABLE "ShopInstallation" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "myshopifyDomain" TEXT,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyStore" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "myshopifyDomain" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "eligibleForBundles" BOOLEAN NOT NULL,
    "storefront" BOOLEAN NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "planDisplayName" TEXT NOT NULL,
    "partnerDevelopment" BOOLEAN NOT NULL,
    "shopifyPlus" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "ianaTimezone" TEXT NOT NULL,
    "primaryDomainId" TEXT NOT NULL,
    "country" TEXT,
    "mailingSubscribed" BOOLEAN NOT NULL DEFAULT true,
    "limitReached" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShopifyStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledUninstall" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledUninstall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSubscription" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'FREE',
    "plan" TEXT,
    "previousPlan" TEXT,
    "revenueTracked" DECIMAL(10,2) DEFAULT 0,
    "monthlyRevenue" DECIMAL(10,2) DEFAULT 0,
    "lastResetDate" TIMESTAMP(3),
    "subscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopInstallation_shop_key" ON "ShopInstallation"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "ShopInstallation_myshopifyDomain_key" ON "ShopInstallation"("myshopifyDomain");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyStore_shop_key" ON "ShopifyStore"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyStore_myshopifyDomain_key" ON "ShopifyStore"("myshopifyDomain");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledUninstall_shop_key" ON "ScheduledUninstall"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "AppSubscription_shop_key" ON "AppSubscription"("shop");

-- AddForeignKey
ALTER TABLE "ShopifyStore" ADD CONSTRAINT "ShopifyStore_shop_fkey" FOREIGN KEY ("shop") REFERENCES "ShopInstallation"("shop") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppSubscription" ADD CONSTRAINT "AppSubscription_shopInstallation_fkey" FOREIGN KEY ("shop") REFERENCES "ShopInstallation"("myshopifyDomain") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppSubscription" ADD CONSTRAINT "AppSubscription_shopifyStore_fkey" FOREIGN KEY ("shop") REFERENCES "ShopifyStore"("myshopifyDomain") ON DELETE RESTRICT ON UPDATE CASCADE;
