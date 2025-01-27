import { useState, useCallback, useEffect } from "react";
import {
  Page, Spinner
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../server/shopify.server";
import { useNavigate, useLoaderData, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { fetchShopInfo } from "../server/fetchShopInfo.server";
import { QUERY } from "../api/QUERY";
import { REGISTERC } from "../api/REGISTERC";
import ComboStep from "../components/ComboStep";


// Loader and Action functions
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const shopInfo = await fetchShopInfo(request);
  return shopInfo.data.shop.currencyFormats.moneyFormat;
};

export const action = async ({ request }) => {
  const { session,admin } = await authenticate.admin(request);
  const formData = await request.formData();

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = JSON.parse(formData.get('formData'));

    const combo = await prisma.combo.create({
      data: {
        sessionId: session.id,
        offerName: data.offerName,
        comboTitle: data.comboTitle,
        products: data.products,
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        callToAction: data.callToAction,
        highlightedTag: data.highlightedTag,
        footerText: data.footerText,
        
        // Title styling
        titleSize: data.titleSize,
        titleStyle: data.titleStyle,
        titleColor: data.titleColor,
        
        // Product title styling
        productTitleSize: data.productTitleSize,
        productTitleStyle: data.productTitleStyle,
        productTitleColor: data.productTitleColor,
        
        // Price styling
        priceSize: data.priceSize,
        priceStyle: data.priceStyle,
        priceColor: data.priceColor,
        
        // Total price styling
        totalPriceSize: data.totalPriceSize,
        totalPriceStyle: data.totalPriceStyle,
        totalPriceColor: data.totalPriceColor,
        
        // New strike price styling
        strikePriceSize: data.strikePriceSize,
        strikePriceStyle: data.strikePriceStyle,
        strikePriceColor: data.strikePriceColor,
        
        // New footer text styling
        footerTextSize: data.footerTextSize,
        footerTextStyle: data.footerTextStyle,
        footerTextColor: data.footerTextColor,
        
        // Tag styling
        tagSize: data.tagSize,
        tagStyle: data.tagStyle,
        tagColor: data.tagColor,
        tagBackground: data.tagBackground,
        
        // Button styling
        buttonTextSize: data.buttonTextSize,
        buttonTextColor: data.buttonTextColor,
        buttonBackground: data.buttonBackground,
        buttonBorderRadius: data.buttonBorderRadius,
        
        // Container styling
        productSpacing: data.productSpacing,
        containerPadding: data.containerPadding,
        containerBackground: data.containerBackground,
        containerBorderRadius: data.containerBorderRadius,
        
        status: data.status,
        
        // Quantity Input Styling
        quantityInputSize: data.quantityInputSize,
        quantityInputStyle: data.quantityInputStyle,
        quantityInputColor: data.quantityInputColor,
        quantityLabelRadius: data.quantityLabelRadius,
        quantityLabelSize: data.quantityLabelSize,
        quantityLabelColor: data.quantityLabelColor,
      }
    });
    const query = await admin.graphql(QUERY);
    const queryResponse = await query.json();
    
    const functionId = queryResponse.data.shopifyFunctions.edges.find(edge => edge.node.title === "combo-discount").node;
    
    const response = await admin.graphql(REGISTERC(functionId.id));
    await response.json();

    return json({ success: true, combo });

  } catch (error) {
    console.error('Error creating combo discount:', error);
    return json({ error: 'Failed to create combo discount' }, { status: 500 });
  }
};

export default function ComboDiscount() {
  const navigate = useNavigate();
  const action = useActionData();
  const app = useAppBridge();
  const submit = useSubmit();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const currencyFormat = useLoaderData();
  
  const navigation = useNavigation();

  // Initial form state
  const [formData, setFormData] = useState({
    offerName: "",
    comboTitle: "Bundle & Save",
    products: [],
    discountType: "percentage",
    discountValue: "",
    callToAction: "Add to Cart",
    highlightedTag: "",
    footerText: "",
    settings:{
      showUnitPrice: false,
      skipCart: false,
      showComparePrice: true
    },
    // UI Customization with defaults
    titleSize: 20,
    titleStyle: "normal",
    titleColor: "#000000",
    productTitleSize: 14,
    productTitleStyle: "normal",
    productTitleColor: "#000000",
    priceSize: 14,
    priceStyle: "normal",
    priceColor: "#000000",
    totalPriceSize: 16,
    totalPriceStyle: "bold",
    totalPriceColor: "#000000",
    tagSize: 12,
    tagStyle: "normal",
    tagColor: "#FFFFFF",
    tagBackground: "#000000",
    buttonTextSize: 14,
    buttonTextColor: "#FFFFFF",
    buttonBackground: "#000000",
    buttonBorderRadius: 4,
    containerPadding:20,
    productSpacing: 15,
    containerBackground: "#FFFFFF",
    containerBorderRadius: 8,
    footerTextSize: 12,
    footerTextStyle: 'normal',
    footerTextColor: '#666666',
    strikePriceSize: 14,
    strikePriceStyle: 'normal',
    strikePriceColor: '#999999',
    quantityInputSize: 8,
    quantityInputStyle: 'normal',
    quantityInputColor: '#000000',
    quantityLabelSize: 4,
    quantityLabelRadius: 4,
    quantityLabelColor: '#B5B5B5',
    status:"draft"
  });

  // Product picker handler
  const handleProductsPicker = useCallback(async () => {
    try {
      const resourcePicker = await app.resourcePicker({
        type: "product",
        action: "select",
        filter:{
          variants: false,
          draft: false,
          archived: false
        },
        multiple: 3,
        selectionIds: formData.products.map(product => ({ id: product.id }))
      });

      if (resourcePicker && resourcePicker.length > 0) {
        const selectedProducts = resourcePicker.map(product => ({
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.images[0] || null,
          price: product.variants[0].price,
          variants: product.variants,
          quantity: 1
        }));

        setFormData(prev => ({
          ...prev,
          products: selectedProducts
        }));
      }
    } catch (error) {
      console.error("Error selecting products:", error);
    }
  }, [app, formData]);

  // Calculate total and discounted prices
  
  useEffect(() => {
    if (action?.success) {
      app.toast.show("Combo Created Successfully");
      setIsLoading(false);
    } else if (!action?.success) {
      setIsLoading(false);
    }
  }, [action, app])
  // Save handler

  // Add at top of file
const validateForm = (data) => {
  const errors = {};

  // Basic Information Validation
  if (!data.offerName?.trim()) {
    errors.offerName = "Offer name is required";
  }
  if (!data.comboTitle?.trim()) {
    errors.comboTitle = "Combo title is required";
  }
  if (!data.products?.length|| data.products.length < 2) {
    errors.products = "Select at least 2 products";
  }
  if (data.products?.length > 3) {
    errors.products = "Maximum 3 products allowed";
  }

  // Discount Validation
  if (!data.discountValue?.trim()) {
    errors.discountValue = "Discount value is required";
  } else {
    const value = parseFloat(data.discountValue);
    switch (data.discountType) {
      case 'percentage':
        if (value <= 0 || value > 100) {
          errors.discountValue = "Percentage must be between 0 and 100";
        }
        break;
      case 'fixed':
      case 'fixed-price':
      case 'flat-per-item':
        if (value <= 0) {
          errors.discountValue = "Amount must be greater than 0";
        }
        break;
    }
  }

  // UI Text Validation
  if (!data.callToAction?.trim()) {
    errors.callToAction = "Call to action text is required";
  }

  return errors;
};
  const handleSave = async (status) => {
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      app.toast.show("Operation Failed", { error: true });
      return;
    }

    const formDataToSend = new FormData();
    
    // Create a copy of formData with updated status
    const updatedFormData = {
      ...formData,
      status: status // Add the status to the form data
    };
    
    // Append the updated data to FormData
    formDataToSend.append("formData", JSON.stringify(updatedFormData));
    setIsLoading(true);
    
    submit(formDataToSend, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  // Success/Error handling
  useEffect(() => {
    if (action?.success) {
      app.toast.show("Combo Created Successfully");
      navigate("/app");
      setIsLoading(false);
    } else if (!action?.success) {
      setIsLoading(false);
    }
  }, [action,app,navigate]);

  if (navigation.state === "loading") {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        <Spinner accessibilityLabel="Loading" size="large" />
      </div>
    );
  }

  return (
    <Page
    backAction={{
      content: "Discounts",
      onAction: () => navigate("/app/create-discount")
    }}
    title="Create Combo Discount"
    primaryAction={{content: 'Publish', loading: isLoading, disabled: isLoading, onAction: () => handleSave('published')}}
    secondaryActions={[
      {
        content: 'Save as Draft',
        loading: isLoading,
        disabled: isLoading,
        onAction: () => handleSave('draft')
      }
    ]}
    >
     <ComboStep
        formData={formData}
        errors={errors}
        setFormData={setFormData}
        currencyFormat={currencyFormat}
        handleProductsPicker={handleProductsPicker}
     />
    </Page>
  );
}
