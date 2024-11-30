import React from "react";
import { Banner, Text, BlockStack } from "@shopify/polaris";
import { Link } from "@remix-run/react";

export function EmbedWarning({ shop, isEmbed1Enabled, isEmbed2Enabled }) {
  const isEmbedEnabled =
    isEmbed1Enabled && isEmbed2Enabled;
  if (isEmbedEnabled) {
    return null;
  }
  const action = !isEmbed1Enabled ? {
    content: "Enable Volume Discount Embed",
    url: `https://${shop}/admin/themes/current/editor?context=apps&template=index&activateAppId=c9dd21c1-710d-4b80-b128-2e82d2237ee9/volume-discount`,
    target: "_blank",
  } : null;
  const secondAction = !isEmbed2Enabled ? {
    content: "Enable Combo Discount Embed",
    url: `https://${shop}/admin/themes/current/editor?context=apps&template=index&activateAppId=c9dd21c1-710d-4b80-b128-2e82d2237ee9/combo-discount`,
    target: "_blank",
  } : null;
  
  return (
    <Banner
      title="Enable app embed to view discounts in your storefront"
      isEmbed1Enabled 
      action={action}
    
      secondaryAction={secondAction}
      tone="warning"
    >
      <BlockStack gap="200">
        <Text variant="bodyMd" as="p">
          Just click on buttons below embed will be enabled automatically then
          hit save.
        </Text> 
        <Text variant="bodyXs" as="p">
          {"Still not sure how to do this, don't worry we are here to help"}{" "}
          <Link to="https://youtu.be/gOTzDq0dOIQ" target="_blank">{"watch tutorial"}</Link>{" "}
          {"or contact us through email."}
        </Text>
      </BlockStack>
    </Banner>
  );
}