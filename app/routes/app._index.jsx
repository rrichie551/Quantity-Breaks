import { useState, useEffect, useCallback } from "react";
import { 
  Page, Layout, EmptyState, Card, DataTable, Button, 
  ButtonGroup, Text, Badge, Spinner, Modal, BlockStack
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData, useNavigation, useFetcher } from "@remix-run/react";
import prisma from "../db.server";
import { fetchMainTheme,fetchShopUrl, fetchThemeContent } from "../server/themeCheck";
import { json } from "@remix-run/node";
import { EmbedWarning } from "../components/EmbedWarning";


async function deleteProduct(discountId, type) {
  if (type === 'volume') {
    await prisma.volume.delete({
      where: { id: discountId },
    });
  } else if (type === 'combo') {
    await prisma.combo.delete({
      where: { id: discountId },
    });
  }
}

async function updateDiscountStatus(discountId, type, newStatus) {
  if (type === 'volume') {
    await prisma.volume.update({
      where: { id: discountId },
      data: { status: newStatus },
    });
  } else if (type === 'combo') {
    await prisma.combo.update({
      where: { id: discountId },
      data: { status: newStatus },
    });
  }
}
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  
  // Fetch both volume and combo discounts
  const volumes = await prisma.volume.findMany({
    where: {
      sessionId: session.id,
    },
    orderBy: { createdAt: 'desc' }
  });
  
  const combos = await prisma.combo.findMany({
    where: {
      sessionId: session.id,
    },
    orderBy: { createdAt: 'desc' }
  });
  const shopUrl = await fetchShopUrl(request);
  const shop = shopUrl.shop.myshopifyDomain;
  const mainTheme = await fetchMainTheme(request);
  console.log("This is the mainTheme", mainTheme);
  let isEmbed1Enabled = "";
  let isEmbed2Enabled = "";

  if (mainTheme?.themes?.nodes?.length > 0) {
    const themeId = mainTheme.themes.nodes[0].id;
    const themeContent = await fetchThemeContent(request, themeId);

    // Check if wishlist_embed block is present in theme
    if (themeContent?.theme?.files?.nodes?.length > 0) {
      try {
        const settingsData = themeContent.theme.files.nodes[0].body.content;
        const cleanSettings = JSON.stringify(settingsData); 
        const moreClen = cleanSettings.replace(/\/\*[\s\S]*?\*\//g, '');
        const moreCleann = JSON.parse(moreClen);
        const finalSettings = JSON.parse(moreCleann);
        console.log(finalSettings);
        const volumeDiscount = Object.values(finalSettings?.current?.blocks).find(block => block.type.includes("volume-discount"));
        const comboDiscount = Object.values(finalSettings?.current?.blocks).find(block => block.type.includes("combo-discount"));
        console.log("This is the volumeDiscount", volumeDiscount);
        isEmbed1Enabled = !volumeDiscount.disabled;
        isEmbed2Enabled =  !comboDiscount.disabled;
      } catch (error) {
        console.error("Error parsing theme settings:", error);
      }
    }
  }
    console.log("This is the isEmbed1Enabled", isEmbed1Enabled);
    console.log("This is the isEmbed2Enabled", isEmbed2Enabled);
  return json({ volumes, combos, isEmbed1Enabled, isEmbed2Enabled, shop });
};
export const action = async ({ request }) => {
  
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");
  if (action === "updateProductStatus") {
    const productId = formData.get("discountId");
    const discountType = formData.get("type");
    const newStatus = formData.get("newStatus");

    try {
      await updateDiscountStatus(productId, discountType, newStatus);
      return json({ success: true });
    } catch (error) {
      return json(
        { success: false, error: "Failed to update discount status" },
        { status: 500 },
      );
    }
  }

  if (action === "deleteProduct") {
    const productId = formData.get("discountId");
    const discountT = formData.get("type");

    try {
      await deleteProduct( productId, discountT);
      return json({ success: true });
    } catch (error) {
      return json(
        { success: false, error: "Failed to delete discount" },
        { status: 500 },
      );
    }
  }
  return json({ success: false, error: "Invalid action" }, { status: 400 });
}

export default function Index() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { volumes, combos, isEmbed1Enabled, isEmbed2Enabled, shop } = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const app = useAppBridge();
  const navigation = useNavigation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStatusChange = useCallback((discountId, type, newStatus) => {
    if (!isClient) return;
    setIsLoading(true);
    fetcher.submit(
      { 
        action: "updateProductStatus", 
        discountId, 
        type,
        newStatus
      },
      { method: "post" }
    );
  }, [fetcher,isClient]);

  const handleDeleteProduct = useCallback((discountId, type) => {
    if (!isClient) return;
    setIsLoading(true);
    fetcher.submit(
      { 
        action: "deleteProduct", 
        discountId,
        type 
      },
      { method: "post" }
    );
  }, [fetcher,isClient]);

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        app.toast.show("Operation completed successfully");
        setIsLoading(false);
        setDeleteModalOpen(false);
      } else if (fetcher.data.error) {
        app.toast.show(fetcher.data.error, { isError: true });
        setIsLoading(false);
        setDeleteModalOpen(false);
      }
    }
  }, [fetcher.data, app]);
 
  // Combine and format discounts for table
  const allDiscounts = [
    ...volumes.map(v => ({ ...v, type: 'volume' })),
    ...combos.map(c => ({ ...c, type: 'combo' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const rows = allDiscounts.map(discount => [
   
    <Text variant="bodyMd" as="span" fontWeight="bold">
      {discount.offerName}
    </Text>,
    <Badge tone={discount.status === 'published' ? 'success' : 'attention'}>
      {discount.status === 'published' ? 'Published' : 'Draft'}
    </Badge>,
    <Text variant="bodyMd" as="span">
      {discount.type === 'volume' ? 'Volume Discount' : 'Combo Discount'}
    </Text>,
    <ButtonGroup>
      <Button
        variant="primary"
        onClick={() => isClient && handleStatusChange(
          discount.id,
          discount.type,
          discount.status === 'published' ? 'draft' : 'published'
        )}
        loading={isLoading}
      >
        {discount.status === 'published' ? 'Draft' : 'Publish'}
      </Button>
      <Button
        onClick={() => navigate(`/app/${discount.type}/${discount.id}`)}
      >
        Edit
      </Button>
      <Button
       variant="primary"
       tone="critical"
        onClick={() => {
          setItemToDelete({
            id: discount.id,
            type: discount.type,
            name: discount.offerName
          });
          setDeleteModalOpen(true);
        }}
      >
        Delete
      </Button>
    </ButtonGroup>
   
  ]);

  if (navigation.state === "loading") {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        <Spinner accessibilityLabel="Loading" size="large" />
      </div>
    );
  }

  if (allDiscounts.length === 0) {
    return (
      <Page>
      
            <BlockStack gap="600">
                <EmbedWarning  shop={shop} isEmbed1Enabled={isEmbed1Enabled} isEmbed2Enabled={isEmbed2Enabled} />
                <Layout>
                  <Layout.Section>
                  
                    <Card>
                      <EmptyState
                        heading="Create Your First Discount"
                        action={{
                          content: "Create Discount",
                          onAction: () => navigate("/app/create-discount")
                        }}
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                      >
                        <p>Choose between Volume Discounts or Combo Discounts to boost your sales.</p>
                      </EmptyState>
                    </Card>
                  </Layout.Section>
                </Layout>
            </BlockStack>
        
      </Page>
    );
  }

  return (
    
    <Page
      title="Dashboard"
      primaryAction={{
        content: "Create Discount",
        onAction: () => navigate("/app/create-discount")
      }}
    >
      <BlockStack gap="600">
       <EmbedWarning  shop={shop} isEmbed1Enabled={isEmbed1Enabled} isEmbed2Enabled={isEmbed2Enabled} />
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['Offer Name', 'Status', 'Type', 'Actions']}
              rows={rows}
              loading={isLoading}
            />
          </Card>
        </Layout.Section>
      </Layout>
      </BlockStack>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Discount"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          onAction: () => isClient && handleDeleteProduct(itemToDelete?.id, itemToDelete?.type),
          loading: isLoading
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setDeleteModalOpen(false)
          }
        ]}
      >
        <Modal.Section>
          <Text>
            Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
