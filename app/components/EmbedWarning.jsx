import React, {useEffect, useState} from "react";
import { Banner, Text, BlockStack,  SkeletonBodyText } from "@shopify/polaris";
import { Link , useFetcher} from "@remix-run/react";

export function EmbedWarning() {
  const fetcher = useFetcher();
  const [isEmbed1Enabled, setisEmbed1Enabled] = useState(false);
  const [isEmbed2Enabled, setisEmbed2Enabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/api/embed-status");
      setLoading(true);
      console.log("fetcher", fetcher);
    }
    console.log("fetcher", fetcher);
  }, [fetcher]);
  useEffect(() => {
    if (fetcher.data) {
      setisEmbed1Enabled(fetcher.data.isEmbed1Enabled);
      setisEmbed2Enabled(fetcher.data.isEmbed2Enabled);
      setShop(fetcher.data.shop);
      setLoading(false);
    }
  }, [fetcher.data]);

  if (isEmbed1Enabled && isEmbed2Enabled) {
    return null;
  }
  return !loading ? (
    <Banner
      title="Enable app embed to view discounts in your storefront"
      isEmbed1Enabled 
      action={{
        content: "Enable Volume Discount Embed",
        url: `https://${shop}/admin/themes/current/editor?context=apps&template=index&activateAppId=c9dd21c1-710d-4b80-b128-2e82d2237ee9/volume-discount`,
        target: "_blank",
        disabled: isEmbed1Enabled
      }}
    
      secondaryAction={{
        content: "Enable Combo Discount Embed",
        url: `https://${shop}/admin/themes/current/editor?context=apps&template=index&activateAppId=c9dd21c1-710d-4b80-b128-2e82d2237ee9/combo-discount`,
        target: "_blank",
        disabled: isEmbed2Enabled
      }}
      tone="warning"
    >
      <BlockStack gap="200">
        <Text variant="bodyMd" as="p">
          Just click on buttons below embed will be enabled automatically then
          hit save.
        </Text> 
        <Text variant="bodyXs" as="p">
          {"Still not sure how to do this, don't worry we are here to help"}{" "}
          <Link to="https://www.loom.com/share/6f235d1482c6451894ae2c29db14ce33?sid=bae13281-c39c-4a10-937e-b19a7b6fecd3" target="_blank">{"watch tutorial"}</Link>{" "}
          {"or contact us through email."}
        </Text>
      </BlockStack>
    </Banner>
  ) : (
    <SkeletonBodyText />
  );
}
