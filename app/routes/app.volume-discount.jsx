import { useState, useCallback, useEffect } from "react";
import {
  Page,
  BlockStack,
  Spinner
} from "@shopify/polaris";
import {  useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../server/shopify.server";
import { useNavigate,useLoaderData,useActionData,useSubmit, useNavigation } from "@remix-run/react";
import { fetchShopInfo } from "../server/fetchShopInfo.server";
import prisma from "../db.server";
import { json } from "@remix-run/node";
import { GET_PRODUCTS } from "../api/GET_PRODUCTS";
import VolumeStep1 from "../components/VolumeStep1";
import VolumeStep2 from "../components/VolumeStep2";
import VolumeStep3 from "../components/VolumeStep3";
import { CREATE_DISCOUNT_NODE } from "../api/CREATE_DISCOUNT_NODE";
import { DISCOUNT_NODES } from "../api/DISCOUNT_NODES";
import {UPDATE_DISCOUNT_NODE} from "../api/UPDATE_DISCOUNT_NODE";

export const loader = async ({ request }) => {
 const {admin} = await authenticate.admin(request);
  const shopInfo = await fetchShopInfo(request);
  const products = await admin.graphql(GET_PRODUCTS);
  const jsonProducts = await products.json();
  return json({ currencyFormat:shopInfo.data.shop.currencyFormats.moneyFormat, products:jsonProducts})
};

export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = JSON.parse(formData.get('formData'));
    const functionId = process.env.SHOPIFY_BULK_DISCOUNT_ID;
    const discounts = await admin.graphql(DISCOUNT_NODES);
    const discountsJson = await discounts.json();
    const discountNodes = discountsJson?.data?.automaticDiscountNodes?.edges?.filter((edge) => edge?.node?.automaticDiscount?.title === "bundlesuite-volume");
    const title = "bundlesuite-volume";
    const namespace = "bundlesuite-volume";
    const key =  "function-configuration";
    const GET_DISCOUNT = `query {
  automaticDiscountNode(id: "${discountNodes[0]?.node?.id}") {
     ... on DiscountAutomaticNode {
            id
            }
            automaticDiscount {
            ... on DiscountAutomaticApp {
                    title 
                }
            }
            metafield(namespace: "${namespace}", key: "${key}") {
           		value
							id
            }
  }
      }`;
    const existingDiscount = await admin.graphql(GET_DISCOUNT);
    const existingDiscountJson = await existingDiscount.json();
    const existingMetafield = existingDiscountJson.data?.automaticDiscountNode?.metafield;
    const baseDiscount = {
      functionId,
      title,
      startsAt: new Date(),
      endsAt: null,
    };

    let metafieldValue;
if (existingMetafield) {
  
  const existingValue = JSON.parse(existingMetafield.value);
  metafieldValue = {
    ...existingValue,
    selectedCollectionIds: data.applyTo === 'COLLECTIONS' 
      ? data.selections.map(selection => selection.id)
      : [],
    [data.offerName]: {
      selectedCollections: data.applyTo === 'COLLECTIONS' 
        ? data.selections.map(selection => selection.id)
        : [],
      discountTarget: data.applyTo,
      discounts: data.offers.map(offer => ({
        productId: data.applyTo === 'PRODUCTS' 
          ? data.selections.map(selection => selection.id)
          : [],
        quantity: parseInt(offer.quantity),
        percentage: offer.discountType === 'percentage' ? parseFloat(offer.discountValue) : null,
        amount: offer.discountType === 'fixed' || offer.discountType === 'flat-per-item' ? parseFloat(offer.discountValue) : null,
        appliesToEachItem: offer.discountType === 'flat-per-item',
        title: offer.offerTitle,
        type: offer.discountType
      }))
    }
  };
} else {
  
  metafieldValue = {
    selectedCollectionIds: data.applyTo === 'COLLECTIONS' 
      ? data.selections.map(selection => selection.id)
      : [],
    [data.offerName]: {
      selectedCollections: data.applyTo === 'COLLECTIONS' 
        ? data.selections.map(selection => selection.id)
        : [],
      discountTarget: data.applyTo,
      discounts: data.offers.map(offer => ({
        productId: data.applyTo === 'PRODUCTS' 
          ? data.selections.map(selection => selection.id)
          : [],
        quantity: parseInt(offer.quantity),
        percentage: offer.discountType === 'percentage' ? parseFloat(offer.discountValue) : null,
        amount: offer.discountType === 'fixed' || offer.discountType === 'flat-per-item' ? parseFloat(offer.discountValue) : null,
        appliesToEachItem: offer.discountType === 'flat-per-item',
        title: offer.offerTitle,
        type: offer.discountType
      }))
    }
  };
}

const metafields = [
  {
    namespace: namespace,
    key: key,
    type: "json",
    value: JSON.stringify(metafieldValue)
  }
];

if(!discountNodes){
  
const response = await admin.graphql(CREATE_DISCOUNT_NODE, {
  variables: {
    discount: {
      ...baseDiscount,
      metafields,
    },
  },
});

    const responseJson = await response.json();
    const errors = responseJson.data.discountCreate?.userErrors;
    const volume = await prisma.volume.create({
      data: {
        sessionId: session.id,  // Link to the current session
        offerName: data.offerName,
        applyTo: data.applyTo,
        selections: data.selections, // Already stringified
        discountType: data.discountType,
        settings: data.settings,
        layout: data.layout,
        status: data.status,
        offers: data.offers, // Already stringified
        blockTitle: data.blockTitle,
        blockTitleSize: data.blockTitleSize,
        blockTitleStyle: data.blockTitleStyle,
        blockTitleColor: data.blockTitleColor,
        offerTitleSize: data.offerTitleSize,
        offerTitleStyle: data.offerTitleStyle,
        offerTitleColor: data.offerTitleColor,
        discountLabelSize: data.discountLabelSize,
        discountLabelStyle: data.discountLabelStyle,
        discountLabelColor: data.discountLabelColor,
        priceTitleSize: data.priceTitleSize,
        priceTitleStyle: data.priceTitleStyle,
        priceTitleColor: data.priceTitleColor,
        cpriceTitleSize: data.cpriceTitleSize,
        cpriceTitleStyle: data.cpriceTitleStyle,
        cpriceTitleColor: data.cpriceTitleColor,
        tagTitleSize: data.tagTitleSize,
        tagTitleStyle: data.tagTitleStyle,
        tagTitleColor: data.tagTitleColor,
        tagBackgroundColor: data.tagBackgroundColor,
        footerText1: data.footerText1,
        footerText2: data.footerText2,
        footerTitleSize: data.footerTitleSize,
        footerTitleStyle: data.footerTitleStyle,
        footerTitleColor: data.footerTitleColor,
        optionBorderColor: data.optionBorderColor,
        optionBackgroundColor: data.optionBackgroundColor,
        optionNonSelectedBackgroundColor: data.optionNonSelectedBackgroundColor,
        borderWidth: data.borderWidth,
        borderRadius: data.borderRadius,
      }
    });
    if(errors){
    return json({ success: false, error: errors });
  }
  else{
    return json({ success: true, volume });
  }
}
else{
  const response = await admin.graphql(UPDATE_DISCOUNT_NODE,
    {
      variables: {
        id: discountNodes[0]?.node?.id,
        automaticAppDiscount: {
            ...baseDiscount,
            metafields:[{
              namespace: namespace,
              key: key,
              id: existingMetafield.id,
              type: "json",
              value: JSON.stringify(metafieldValue)
            }]
        }
      },
    },
  );
  
      const responseJson = await response.json();
      const errors = responseJson.data.discountCreate?.userErrors;
      const volume = await prisma.volume.create({
        data: {
          sessionId: session.id,  // Link to the current session
          offerName: data.offerName,
          applyTo: data.applyTo,
          selections: data.selections, // Already stringified
          discountType: data.discountType,
          settings: data.settings,
          layout: data.layout,
          status: data.status,
          offers: data.offers, // Already stringified
          blockTitle: data.blockTitle,
          blockTitleSize: data.blockTitleSize,
          blockTitleStyle: data.blockTitleStyle,
          blockTitleColor: data.blockTitleColor,
          offerTitleSize: data.offerTitleSize,
          offerTitleStyle: data.offerTitleStyle,
          offerTitleColor: data.offerTitleColor,
          discountLabelSize: data.discountLabelSize,
          discountLabelStyle: data.discountLabelStyle,
          discountLabelColor: data.discountLabelColor,
          priceTitleSize: data.priceTitleSize,
          priceTitleStyle: data.priceTitleStyle,
          priceTitleColor: data.priceTitleColor,
          cpriceTitleSize: data.cpriceTitleSize,
          cpriceTitleStyle: data.cpriceTitleStyle,
          cpriceTitleColor: data.cpriceTitleColor,
          tagTitleSize: data.tagTitleSize,
          tagTitleStyle: data.tagTitleStyle,
          tagTitleColor: data.tagTitleColor,
          tagBackgroundColor: data.tagBackgroundColor,
          footerText1: data.footerText1,
          footerText2: data.footerText2,
          footerTitleSize: data.footerTitleSize,
          footerTitleStyle: data.footerTitleStyle,
          footerTitleColor: data.footerTitleColor,
          optionBorderColor: data.optionBorderColor,
          optionBackgroundColor: data.optionBackgroundColor,
          optionNonSelectedBackgroundColor: data.optionNonSelectedBackgroundColor,
          borderWidth: data.borderWidth,
          borderRadius: data.borderRadius,
        }
      });
      if(errors){
      return json({ success: false, error: errors });
    }
    else{
      return json({ success: true, volume });
    }
}


  } catch (error) {
    console.error('Error creating volume discount:', error);
    return json({ error: 'Failed to create volume discount' }, { status: 500 });
  }
};

export default function VolumeDiscount() {
  const navigate = useNavigate();
  const action = useActionData();
  const app = useAppBridge();
  const submit = useSubmit();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    offerName: "",
    applyTo: "PRODUCTS",
    selections: [],
    discountType: "tiered",
    status: "draft",
    layout: 'vertical',
    offers: [{
      discountType: 'percentage',
      discountValue: '10',
      quantity: '2',
      offerTitle: '1 Pair',
      discountLabel: '',
      tag: '',
      active: false
    },
    {
      discountType: 'percentage',
      discountValue: '15',
      quantity: '6',
      offerTitle: '3 Pair',
      discountLabel: '10% OFF',
      tag: '',
      active: false
    },
    {
      discountType: 'percentage',
      discountValue: '20',
      quantity: '12',
      offerTitle: '6 Pair',
      discountLabel: '30% OFF',
      tag: 'Most Popular',
      active: true
    }],
    settings: {
      showUnitPrice: false,
      showTotalPrice: true,
      allowVariants: false,
      displayBelowCart: false,
      skipCart: false,
      showComparePrice: true,
      unitPriceLabel: '/each',
    },
    blockTitle: 'Bulk Discount',
    footerText1: 'Free Shipping in 3 Days',
    footerText2: 'Total',
    blockTitleSize: 20,
    blockTitleColor: '#fd7a75',
    offerTitleColor: '#fd7a75',
    discountLabelColor: '#1c221e',
    priceTitleColor: '#836161',
    cpriceTitleColor: '#808080',
    tagTitleColor: '#FFFFFF',
    tagBackgroundColor: '#fd7a75',
    footerTitleColor: '#fd7a75',
    optionBorderColor: '#fd7a75',
    optionBackgroundColor: '#f5e5e6',
    optionNonSelectedBackgroundColor: '#ffffff',
    blockTitleStyle: 'normal',
    offerTitleSize: 13,
    offerTitleStyle: 'normal',
    discountLabelSize: 10,
    discountLabelStyle: 'normal',
    priceTitleSize: 10,
    priceTitleStyle: 'normal',
    cpriceTitleSize: 8,
    cpriceTitleStyle: 'normal',
    tagTitleSize: 10,
    tagTitleStyle: 'normal',
    footerTitleSize: 10,
    footerTitleStyle: 'normal',
    borderWidth: 1,
    borderRadius: 8
  });
  const {currencyFormat, products} = useLoaderData();
  
  const navigation = useNavigation();

  useEffect(() => {
    if (action?.success) {
      app.toast.show("Discount Created Successfully");
      setIsLoading(false);
      navigate("/app");
     
      
    } else if (!action?.success) {
      setIsLoading(false);
    }
  }, [action, app,setIsLoading,navigate]);
 

  const handleProductsPicker = useCallback(async () => {
    try {
      const resourcePicker = await app.resourcePicker({
        type: "product",
        action: "select",
        filter: { variants: false, draft: false, archived: false },
        multiple: true,
        selectionIds: formData.selections.map(product => ({ id: product.id }))
      });
      
      if (resourcePicker && resourcePicker.length > 0) {
        const selectedProducts = resourcePicker.map(product => ({
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.images[0] || null,
          price: product.variants[0].price,
          options: product.options
        }));
       
        setFormData(prev => ({
          ...prev,
          selections: selectedProducts
        }));
      }
    } catch (error) {
      console.error("Error selecting products:", error);
    }
  }, [app,formData]);

  const handleCollectionsPicker = useCallback(async () => {
    try {
      const resourcePicker = await app.resourcePicker({
        type: "collection",
        action: "select",
        multiple: false,
        selectionIds: formData.selections.map(collection => ({ id: collection.id }))
      });
     
      if (resourcePicker && resourcePicker.length > 0) {
        const selectedCollection = resourcePicker.map(product => ({
            id: product.id,
            title: product.title,
            productsCount: product.productsCount,
            price: products.data.products.edges[0].node.priceRangeV2.maxVariantPrice.amount
            
          }));

        setFormData(prev => ({
          ...prev,
          selections: selectedCollection
        }));
      }
    } catch (error) {
      console.error("Error selecting collection:", error);
    }
  }, [app,formData,products]);

  const handleDeleteSelection = useCallback((idToDelete) => {
    setFormData((prev) => {
      const updatedSelections = prev.selections.filter(item => item.id !== idToDelete);
      return {
        ...prev,
        selections: updatedSelections
      };
    });
  }, []);  

  const validateForm = (data) => {
    var errors = {};
  
    // Validate offer name
    if (!data.offerName?.trim()) {
      errors.offerName = "Offer name is required";
    }
  
    // Validate selections
    if (!data.selections || data.selections.length === 0) {
      errors.selections = "Please select at least one product or collection";
    }
  
    // Validate offers
    data.offers.forEach((offer, index) => {
      if (!offer.quantity || parseInt(offer.quantity) <= 0) {
        if (!errors.offers) errors.offers = {};
        if (!errors.offers[index]) errors.offers[index] = {};
        errors.offers[index].quantity = "Quantity must be greater than 0";
      }
      if (!offer.offerTitle?.trim()) {
        if (!errors.offers) errors.offers = {};
        if (!errors.offers[index]) errors.offers[index] = {};
        errors.offers[index].offerTitle = "Offer title is required";
      }
      const hasFixedDiscount = data.offers.some(offer => offer.discountType === 'fixed');
      if (hasFixedDiscount) {
        if (data.applyTo === "PRODUCTS" && offer.discountType === 'fixed') {
          if (!errors.offers) errors.offers = {};
          if (!errors.offers[index]) errors.offers[index] = {};
          if (data.selections.length > 1) {
            errors.offers[index].discountType = "Fixed price discount can only be applied to a single product";
          }
          else{
            errors.offers = {};
            errors= {};
          }
        } else if (data.applyTo === "COLLECTIONS" && offer.discountType === 'fixed') {
          if (!errors.offers) errors.offers = {};
          if (!errors.offers[index]) errors.offers[index] = {};
          errors.offers[index].discountType = "Fixed price discount cannot be applied to collections";
        }
        
      }
        
     
  
      if (!offer.discountValue?.trim()) {
        if (!errors.offers) errors.offers = {};
        if (!errors.offers[index]) errors.offers[index] = {};
        errors.offers[index].discountValue = "Discount value is required";
      } else {
        const value = parseFloat(offer.discountValue);
        switch (offer.discountType) {
          case 'percentage':
            if (value < 0) {
              if (!errors.offers) errors.offers = {};
              if (!errors.offers[index]) errors.offers[index] = {};
              errors.offers[index].discountValue = "Percentage cannot be negative";
            } else if (value > 100) {
              if (!errors.offers) errors.offers = {};
              if (!errors.offers[index]) errors.offers[index] = {};
              errors.offers[index].discountValue = "Percentage cannot exceed 100%";
            }
            break;
          case 'flat-per-item':
            if (value <= 0) {
              if (!errors.offers) errors.offers = {};
              if (!errors.offers[index]) errors.offers[index] = {};
              errors.offers[index].discountValue = "Amount must be greater than 0";
            }
            break;
        }
      }
    });
   
  
    return errors;
  };

  const handleSave = async (status) => {
    const validationErrors = validateForm(formData);


  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      app.toast.show("Operation Failed", { isError: true });
     
      return;
    }
    const formDataToSend = new FormData();
    
   
    const updatedFormData = {
      ...formData,
      status: status 
    };
    
    
    formDataToSend.append("formData", JSON.stringify(updatedFormData));
    setIsLoading(true);
    
    submit(formDataToSend, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

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
  title="Create Volume Discount"
  primaryAction={
    step === 1 ? {
      content: 'Next',
      disabled: !formData.offerName || formData.selections.length === 0,
      onAction: () => setStep(2)
    } : step === 2 ? {
      content: 'Next',
      onAction: () => setStep(3)
    } : {
      content: 'Publish',
      loading: isLoading, 
      disabled: isLoading,
      onAction: () => handleSave('published')
    }
  }
  secondaryActions={
    step === 1 ? [] : 
    step === 2 ? [
      {
        content: 'Back',
        onAction: () => setStep(1)
      }
    ] : [
      {
        content: 'Save as Draft',
        loading: isLoading, 
        disabled: isLoading,
        onAction: () => handleSave('draft')
      },
      {
        content: 'Back',
        onAction: () => setStep(2)
      }
    ]
  }
>
    <BlockStack gap="800">
      {step === 1 &&  
          <VolumeStep1
            formData={formData}
            errors={errors}
            setFormData={setFormData}
            handleProductsPicker={handleProductsPicker}
            handleCollectionsPicker={handleCollectionsPicker}
            handleDeleteSelection={handleDeleteSelection}
          />
      }
      {step === 2 && 
        <VolumeStep2
          formData={formData}
          setFormData={setFormData}
        />
      }
      {step === 3 && 
        <VolumeStep3
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          handleProductsPicker={handleProductsPicker}
          handleCollectionsPicker={handleCollectionsPicker}
          currencyFormat={currencyFormat}
          handleDeleteSelection={handleDeleteSelection}
        />
      }
      </BlockStack>
    </Page>
  );
}
