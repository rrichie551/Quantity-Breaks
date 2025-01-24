import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  RadioButton,
  Button,
  Text,
  BlockStack,
  Box,
  Grid,
  Avatar,
  ResourceItem,
  ResourceList,
  InlineStack,
  Select,
  Spinner,
  Icon,
  Badge,
  Checkbox,
  RangeSlider,
  InlineError
} from "@shopify/polaris";
import {  useAppBridge, Modal, TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../server/shopify.server";
import { useNavigate,useLoaderData,useActionData,useSubmit, useNavigation } from "@remix-run/react";
import { DeleteIcon, XIcon,EditIcon } from "@shopify/polaris-icons";
import { fetchShopInfo } from "../server/fetchShopInfo.server";
import prisma from "../db.server";
import { json } from "@remix-run/node";
import { QUERY } from "../api/QUERY";
import { REGISTERV } from "../api/REGISTERV";
import { GET_PRODUCTS } from "../api/GET_PRODUCTS";

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

    const volume = await prisma.volume.create({
      data: {
        sessionId: session.id,  // Link to the current session
        offerName: data.offerName,
        applyTo: data.applyTo,
        selections: data.selections, // Already stringified
        discountType: data.discountType,
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
    const query = await admin.graphql(QUERY);
    const queryResponse = await query.json();
      const functionId = queryResponse.data.shopifyFunctions.edges.find(edge => edge.node.title === "ProfitSuite").node;
      const response = await admin.graphql(REGISTERV(functionId.id));
      await response.json(); 
    return json({ success: true, volume });

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
  const currencySymbol = currencyFormat.split('{{')[0].trim();
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
      console.log("Select: ",resourcePicker);
      if (resourcePicker && resourcePicker.length > 0) {
        const selectedProducts = resourcePicker.map(product => ({
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.images[0] || null,
          price: product.variants[0].price,
          options: product.options
        }));
        console.log("Selected products: " + selectedProducts);
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
      console.log("This is a collection:", resourcePicker);
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
  }, [app,formData]);

  const handleDeleteSelection = useCallback((idToDelete) => {
    setFormData((prev) => {
      const updatedSelections = prev.selections.filter(item => item.id !== idToDelete);
      return {
        ...prev,
        selections: updatedSelections
      };
    });
  }, []);

  const handleDeleteOffer = (indexToDelete) => {
    setFormData(prev => ({
      ...prev,
      offers: prev.offers.filter((_, index) => index !== indexToDelete)
    }));
  };
  
  const discountTypes = [
    {
        id: "basic",
        title: "Custom Discount",
        description: "Create straightforward quantity break discounts, offering fixed percentage or dollar-based savings as customers purchase higher quantities.",
        image: "https://cdn.shopify.com/s/files/1/0641/6033/3877/files/Screenshot_2024-11-25_at_5.06.56_PM.png?v=1732534629",
      },
      {
        id: "tiered",
        title: "Bulk Discount",
        description: "Encourage larger purchases with progressive discounts. Examples include 'Buy 2 Save 10%, Buy 4 Save 20%, Buy 6 Save 30%'.",
        image: "https://cdn.shopify.com/s/files/1/0641/6033/3877/files/Screenshot_2024-11-25_at_5.02.14_PM.png?v=1732534358",
      },
      {
        id: "bxgy",
        title: "Buy X Get Y",
        description: "Offer free bonus items when customers buy a specific quantity. Examples include 'Buy 1 Get 1 Free', 'Buy 2 Get 2 Free' or 'Buy 3 Get 3 Free'",
        image: "https://cdn.shopify.com/s/files/1/0641/6033/3877/files/Screenshot_2024-11-21_at_10.23.50_AM.png?v=1732533680",
      }
  ];
  const discountTitles = {
    basic: "Flash Sale!!",
    tiered: "Bulk Discount",
    bxgy: "BOGO Discount"
  };
  const styleTemplates = {
    basic: {
      blockTitleColor: '#71c280',
      offerTitleColor: '#25c16e',
      discountLabelColor: '#1c221e',
      priceTitleColor: '#776365',
      cpriceTitleColor: '#c7979a',
      tagTitleColor: '#FFFFFF',
      tagBackgroundColor: '#51cc7e',
      footerTitleColor: '#5ec47a',
      optionBorderColor: '#5ec47a',
      optionBackgroundColor: '#d7ffdb',
      optionNonSelectedBackgroundColor: '#ffffff'
    },
    tiered: {
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
      optionNonSelectedBackgroundColor: '#ffffff'
    },
    bxgy: {
      blockTitleColor: '#1c221e',
      offerTitleColor: '#000000',
      discountLabelColor: '#1c221e',
      priceTitleColor: '#000000',
      cpriceTitleColor: '#808080',
      tagTitleColor: '#FFFFFF',
      tagBackgroundColor: '#1c221e',
      footerTitleColor: '#1c221e',
      optionBorderColor: '#1c221e',
      optionBackgroundColor: '#ffffff',
      optionNonSelectedBackgroundColor: '#ffffff'
    }
  };
  const themeColorMappings = {
    theme1: {
      blockTitleColor: '#4289ff',
      offerTitleColor: '#4289ff',
      discountLabelColor: '#1c221e',
      priceTitleColor: '#4289ff',
      cpriceTitleColor: '#808080',
      tagTitleColor: '#FFFFFF',
      tagBackgroundColor: '#4289ff',
      footerTitleColor: '#4289ff',
      optionBorderColor: '#4289ff',
      optionBackgroundColor: '#f9faff',
      optionNonSelectedBackgroundColor: '#ffffff'
    },
    theme2: {
      blockTitleColor: '#ff6b82',
      offerTitleColor: '#ff6b82',
      discountLabelColor: '#1c221e',
      priceTitleColor: '#ff6b82',
      cpriceTitleColor: '#808080',
      tagTitleColor: '#FFFFFF',
      tagBackgroundColor: '#ff6b82',
      footerTitleColor: '#ff6b82',
      optionBorderColor: '#ff6b82',
      optionBackgroundColor: '#fff9fa',
      optionNonSelectedBackgroundColor: '#ffffff'
    },
    theme3: {
      blockTitleColor: '#237f00',
      offerTitleColor: '#237f00',
      discountLabelColor: '#1c221e',
      priceTitleColor: '#237f00',
      cpriceTitleColor: '#808080',
      tagTitleColor: '#FFFFFF',
      tagBackgroundColor: '#237f00',
      footerTitleColor: '#237f00',
      optionBorderColor: '#237f00',
      optionBackgroundColor: '#f4fbf9',
      optionNonSelectedBackgroundColor: '#ffffff'
    }
  };
  const discountTemplates = {
    basic: [
      {
        discountType: 'percentage',
        discountValue: '10',
        quantity: '1',
        offerTitle: '1 Item',
        discountLabel: '',
        tag: '',
        active: false
      },
      {
        discountType: 'percentage',
        discountValue: '15',
        quantity: '2',
        offerTitle: '2 Items',
        discountLabel: '20% OFF',
        tag: 'Most Popular',
        active: true
      },
      {
        discountType: 'percentage',
        discountValue: '20',
        quantity: '3',
        offerTitle: '3 Items',
        discountLabel: '30% OFF',
        tag: '',
        active: false
      }
    ],
    tiered: [
      {
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
      }
    ],
    bxgy: [
      {
        discountType: 'percentage',
        discountValue: '50',
        quantity: '2',
        offerTitle: 'Buy 1 Get 1 Free',
        discountLabel: '50% Off',
        tag: 'Most Popular',
        active: true
      },
      {
        discountType: 'percentage',
        discountValue: '50',
        quantity: '4',
        offerTitle: 'Buy 2 Get 2 Free',
        discountLabel: '',
        tag: '',
        active: false
      },
      {
        discountType: 'percentage',
        discountValue: '50',
        quantity: '6',
        offerTitle: 'Buy 3 Get 3 Free',
        discountLabel: '',
        tag: '',
        active: false
      }
    ]
  };

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
      console.log(validationErrors);
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


  const calculateDiscountedPrice = (offer, originalPrice) => {
    let basePrice = originalPrice;
    if (!formData?.settings?.showUnitPrice){
       basePrice = offer.quantity * originalPrice;
  }
    
    switch (offer.discountType) {
      case 'percentage':
       
        return basePrice - (basePrice * (parseFloat(offer.discountValue) / 100));
        
      case 'flat':
        
        return basePrice - parseFloat(offer.discountValue);
        
      case 'flat-per-item':
       
        return basePrice - (parseFloat(offer.discountValue) * offer.quantity);
        
      case 'fixed':
        
        return parseFloat(offer.discountValue);
        
      default:
        return basePrice;
    }
  };
  const calculateDiscountedPrice2 = (offer, originalPrice) => {
    const basePrice = offer.quantity * originalPrice;

    switch (offer.discountType) {
      case 'percentage':
       
        return basePrice - (basePrice * (parseFloat(offer.discountValue) / 100));
        
      case 'flat':
        
        return basePrice - parseFloat(offer.discountValue);
        
      case 'flat-per-item':
       
        return basePrice - (parseFloat(offer.discountValue) * offer.quantity);
        
      case 'fixed':
        
        return parseFloat(offer.discountValue);
        
      default:
        return basePrice;
    }
  };

  const handleActiveOfferChange = (selectedIndex) => {
    setFormData(prev => ({
      ...prev,
      offers: prev.offers.map((offer, index) => ({
        ...offer,
        active: index === selectedIndex
      }))
    }));
  };


    const discountIcons = {
      tiered: {
        svg: <svg xmlns="http://www.w3.org/2000/svg" fill="#ff8985" width="24px" height="24px" viewBox="-12.8 -12.8 153.60 153.60">
          <g>
            <rect height="8" width="64" x="53" y="17"/>
            <rect height="8" width="64" x="53" y="60"/>
            <rect height="8" width="64" x="53" y="103"/>
            <path d="M21,121c7.7,0,14-6.3,14-14s-6.3-14-14-14S7,99.3,7,107S13.3,121,21,121z M21,101c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S17.7,101,21,101z"/>
            <path d="M21,78c7.7,0,14-6.3,14-14s-6.3-14-14-14S7,56.3,7,64S13.3,78,21,78z M21,58c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S17.7,58,21,58z"/>
            <path d="M21,35c7.7,0,14-6.3,14-14S28.7,7,21,7S7,13.3,7,21S13.3,35,21,35z M21,15c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S17.7,15,21,15z"/>
          </g>
        </svg>,
        color: "#ff8985",
        text: "Bulk Discount"
      },
      basic: {
        svg: 
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#25c16e" width="24px" height="24px" viewBox="-12.8 -12.8 153.60 153.60" id="Layer_1" version="1.1" xml:space="preserve" stroke="#25c16e">

        <g id="SVGRepo_bgCarrier" stroke-width="0"/>

        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

        <g id="SVGRepo_iconCarrier"> <g> <rect height="8" width="64" x="53" y="17"/> <rect height="8" width="64" x="53" y="60"/> <rect height="8" width="64" x="53" y="103"/> <path d="M21,121c7.7,0,14-6.3,14-14s-6.3-14-14-14S7,99.3,7,107S13.3,121,21,121z M21,101c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6 S17.7,101,21,101z"/> <path d="M21,78c7.7,0,14-6.3,14-14s-6.3-14-14-14S7,56.3,7,64S13.3,78,21,78z M21,58c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6 S17.7,58,21,58z"/> <path d="M21,35c7.7,0,14-6.3,14-14S28.7,7,21,7S7,13.3,7,21S13.3,35,21,35z M21,15c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6 S17.7,15,21,15z"/> </g> </g>

        </svg>
        ,
        color: "#25c16e",
        text: "Custom Discount"
      },
      bxgy: {
        svg: 
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#1c221e" width="24px" height="24px" viewBox="-12.8 -12.8 153.60 153.60" id="Layer_1" version="1.1" xml:space="preserve" stroke="##25c16e">

        <g id="SVGRepo_bgCarrier" stroke-width="0"/>

        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

        <g id="SVGRepo_iconCarrier"> <g> <rect height="8" width="64" x="53" y="17"/> <rect height="8" width="64" x="53" y="60"/> <rect height="8" width="64" x="53" y="103"/> <path d="M21,121c7.7,0,14-6.3,14-14s-6.3-14-14-14S7,99.3,7,107S13.3,121,21,121z M21,101c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6 S17.7,101,21,101z"/> <path d="M21,78c7.7,0,14-6.3,14-14s-6.3-14-14-14S7,56.3,7,64S13.3,78,21,78z M21,58c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6 S17.7,58,21,58z"/> <path d="M21,35c7.7,0,14-6.3,14-14S28.7,7,21,7S7,13.3,7,21S13.3,35,21,35z M21,15c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6 S17.7,15,21,15z"/> </g> </g>

        </svg>
        ,
        color: "#1c221e",
        text: "BOGO Discount"
      }
    };
    const themeColors = {
      theme1: {
        border: '#4289ff',
        fill: '#4289ff', 
        background: '#f9faff'
      },
      theme2: {
        border: '#ff6b82',
        fill: '#ff6b82',
        background: '#fff9fa'
      },
      theme3: {
        border: '#237f00',
        fill: '#237f00',
        background: '#f4fbf9'
      }
    };

    useEffect(() => {
      if (formData.layout === 'horizontal') {
        setSelectedTheme('horizontal1');
      } else {
        setSelectedTheme('theme1');
      }
    }, [formData.layout]);
    const icon = discountIcons[formData.discountType];

  const [detailsModal, setDetailsModal] = useState(false);
  const [detailsModal2, setDetailsModal2] = useState(false);
  const handleDetailsModal = useCallback(
    () => setDetailsModal((open) => !open),
    [],
  );
  const handleDetailsModal2 = useCallback(
    () => setDetailsModal2((open) => !open),
    [],
  );
  const handleDetailsModal3 = useCallback(
    () => shopify.modal.show('my-modal'),
    [],
  );
  const [selectedTheme, setSelectedTheme] = useState('theme1');

    const handleThemeChange = (theme) => {
      setSelectedTheme(theme);
      if (formData.layout === 'vertical') {
        setFormData(prev => ({
          ...prev,
          blockTitleColor: themeColorMappings[theme].blockTitleColor,
          offerTitleColor: themeColorMappings[theme].offerTitleColor,
          discountLabelColor: themeColorMappings[theme].discountLabelColor,
          priceTitleColor: themeColorMappings[theme].priceTitleColor,
          cpriceTitleColor: themeColorMappings[theme].cpriceTitleColor,
          tagTitleColor: themeColorMappings[theme].tagTitleColor,
          tagBackgroundColor: themeColorMappings[theme].tagBackgroundColor,
          footerTitleColor: themeColorMappings[theme].footerTitleColor,
          optionBorderColor: themeColorMappings[theme].optionBorderColor,
          optionBackgroundColor: themeColorMappings[theme].optionBackgroundColor,
          optionNonSelectedBackgroundColor: themeColorMappings[theme].optionNonSelectedBackgroundColor
        }));
      }
    };
  const handleLayoutChange = (newLayout) => {
    setFormData(prev => ({
      ...prev,
      layout: newLayout
    }));
    if(newLayout === 'horizontal'){
      setFormData(prev =>({
        ...prev,
        blockTitleColor: styleTemplates[formData.discountType].blockTitleColor,
        offerTitleColor: styleTemplates[formData.discountType].offerTitleColor,
        discountLabelColor: styleTemplates[formData.discountType].discountLabelColor,
        priceTitleColor: styleTemplates[formData.discountType].priceTitleColor,
        cpriceTitleColor: styleTemplates[formData.discountType].cpriceTitleColor,
        tagTitleColor: styleTemplates[formData.discountType].tagTitleColor,
        tagBackgroundColor: styleTemplates[formData.discountType].tagBackgroundColor,
        footerTitleColor: styleTemplates[formData.discountType].footerTitleColor,
        optionBorderColor: styleTemplates[formData.discountType].optionBorderColor,
        optionBackgroundColor: styleTemplates[formData.discountType].optionBackgroundColor,
        optionNonSelectedBackgroundColor: styleTemplates[formData.discountType].optionNonSelectedBackgroundColor
      }))
    }
  };
  const renderStep1 = () => (
        <Card>
          <BlockStack gap="500">
            <FormLayout>
              <TextField
                label="Offer Name"
                value={formData.offerName}
                error={errors.offerName}
                onChange={(value) => setFormData(prev => ({ ...prev, offerName: value }))}
                autoComplete="off"
              />
              
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Apply Offer To</Text>
                
                <Box>
                  <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <RadioButton
                      label="Products"
                      checked={formData.applyTo === "PRODUCTS"}
                      id="products-radio"
                      name="apply-to"
                      onChange={() => setFormData(prev => ({ 
                        ...prev, 
                        applyTo: "PRODUCTS", 
                        selections: [] 
                      }))}
                    />
                    
                    <RadioButton
                      label="Collections"
                      checked={formData.applyTo === "COLLECTIONS"}
                      id="collections-radio"
                      name="apply-to"
                      onChange={() => setFormData(prev => ({ 
                        ...prev, 
                        applyTo: "COLLECTIONS", 
                        selections: [] 
                      }))}
                    />
                  </div>
                </Box>
                
                {formData.applyTo === "PRODUCTS" && (
                  <BlockStack gap="300">
                    <Button variant='primary' onClick={handleProductsPicker}>
                      Select Products {formData.selections.length > 0 ? `(${formData.selections.length} selected)` : ''}
                    </Button>
                    {formData.selections.length > 0 && (
                      <Box padding="300" background="bg-subdued" borderRadius="100">
                        <BlockStack gap="300">
                <ResourceList
                  resourceName={{
                    singular: 'Product',
                    plural: 'Products'
                  }}
                  items={formData.selections}
                  renderItem={(product) => (
                    <ResourceItem
                      id={product.id}
                      accessibilityLabel={product.title}
                      media={
                        <Avatar
                          customer
                          size="md"
                          name={product.title}
                          source={product.image?.originalSrc || product.image?.url}
                        />
                      }
                    >
                      <InlineStack align="space-between">
                        <BlockStack>
                          <Text variant="bodyMd" fontWeight="bold">
                            {product.title}
                          </Text>
                        </BlockStack>
                        <Button
                          icon={DeleteIcon}
                          tone="critical"
                          onClick={() => handleDeleteSelection(product.id)}
                        />
                      </InlineStack>
                    </ResourceItem>
                  )}
                />
            </BlockStack>
                      </Box>
                    )}
                  </BlockStack>
                )}
                
                {formData.applyTo === "COLLECTIONS" && (
                  <BlockStack gap="300">
                    <Button  variant='primary' onClick={handleCollectionsPicker}>
                      Select Collection
                    </Button>
                    {formData.selections.length > 0 && (
                    
                        <ResourceItem
                          id={formData.selections[0].id}
                          accessibilityLabel={formData.selections[0].title}
                          media={
                            <Avatar customer size="md" name={formData.selections[0].title} />
                          }
                        >
                          <InlineStack align="space-between">
                            <BlockStack>
                              <Text variant="bodyMd" fontWeight="bold">
                                {formData.selections[0].title}
                              </Text>
                              <Text variant="bodySm" color="subdued">
                               {formData.selections[0].productsCount}
                              </Text>
                            </BlockStack>
                            <Button
                              icon={DeleteIcon}
                              tone="critical"
                              onClick={() => handleDeleteSelection(formData.selections[0].id)}
                            />
                          </InlineStack>
                        </ResourceItem>
                    
                    )}
                  </BlockStack>
                )}
              </BlockStack>
            </FormLayout>
          </BlockStack>
        </Card>
  );

  const renderStep2 = () => (
   
        <Card>
          <BlockStack gap="500">
            <Text variant="headingMd" as="h2">Select Discount Type</Text>
            <Grid gap="400">
              {discountTypes.map((type) => (
                <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 4, xl: 4 }} key={type.id}>
                  <Box
                    padding="400"
                    background={formData.discountType === type.id ? "bg-surface-selected" : "bg-surface"}
                    borderWidth="1"
                    borderRadius="200"
                    borderColor={formData.discountType === type.id ? "border-success" : "border"}
                    onClick={() => 
                      setFormData({
                        ...formData, 
                        discountType: type.id, 
                        blockTitle: discountTitles[type.id], 
                        offers: discountTemplates[type.id],
                        blockTitleColor: styleTemplates[type.id].blockTitleColor,
                        offerTitleColor: styleTemplates[type.id].offerTitleColor,
                        discountLabelColor: styleTemplates[type.id].discountLabelColor,
                        priceTitleColor: styleTemplates[type.id].priceTitleColor,
                        cpriceTitleColor: styleTemplates[type.id].cpriceTitleColor,
                        tagTitleColor: styleTemplates[type.id].tagTitleColor,
                        tagBackgroundColor: styleTemplates[type.id].tagBackgroundColor,
                        footerTitleColor: styleTemplates[type.id].footerTitleColor,
                        optionBorderColor: styleTemplates[type.id].optionBorderColor,
                        optionBackgroundColor: styleTemplates[type.id].optionBackgroundColor,
                        optionNonSelectedBackgroundColor: styleTemplates[type.id].optionNonSelectedBackgroundColor
                      })}
                    as="button"
                  >
                    <BlockStack gap="400">
                      <img
                        src={type.image}
                        alt={type.title}
                        style={{ width: "100%", height: "300px" }}
                      />
                      <Text variant="headingSm" as="h3">{type.title}</Text>
                      <Text variant="bodyMd" as="p">{type.description}</Text>
              
                    </BlockStack>
                  </Box>
                </Grid.Cell>
              ))}
            </Grid>
          </BlockStack>
        </Card>
  );

  const renderStep3 = () => (
   
     <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px'}} className="layoutGrid">
        <BlockStack gap="500">
          {/* Offers Section */}
         
                    <Box
                    padding="400"
                    background="bg-surface"
                    borderRadius="200"
                    shadow="200"
                    borderColor="#dedede"
                    borderStyle="solid"
                    position="relative"
                  >
                    <BlockStack gap="200">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:"space-between",
                        gap: "50px",
                      }}
                    >
                      <>
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            opacity: detailsModal ? "1" : "0",
                            zIndex: detailsModal ? "1000" : "-1",
                            width: "100%",
                            transition: "0.3s ease all",
                            boxShadow: "0 1.25rem 1.25rem -.5rem #1a1a1a47",
                          }}
                          className="overlay"
                        >
                          <Card>
                         
                            <BlockStack gap="600">
                            <Text variant="headingMd" as="h6">
                            Offer Name
                              </Text>
                              <TextField
                                value={formData.offerName}
                                error={errors.offerName}
                                onChange={(value) => setFormData(prev => ({ ...prev, offerName: value }))}
                                autoComplete="off"
                              />
                              <InlineStack gap="200" align="end">
                                <Button onClick={handleDetailsModal}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleDetailsModal}
                                  variant="primary"
                                >
                                  Save
                                </Button>
                              </InlineStack>
                            </BlockStack>
                          </Card>
                        </div>
                        <Modal id="my-modal" variant="large">
                       
                        <TitleBar title="Select Discount Type"></TitleBar>
                         
                            <BlockStack gap="600">
                           
                             <div style={{ display: "flex", alignItems:"stretch", gap:"10px", justifyContent:"space-between",padding:"10px" }}>
              {discountTypes.map((type) => (
               
                  <Box
                    padding="400"
                    key={type.id}
                    background={formData.discountType === type.id ? "bg-surface-selected" : "bg-surface"}
                    borderWidth="1"
                    borderRadius="200"
                    borderColor={formData.discountType === type.id ? "border-success" : "border"}
                    onClick={() => 
                      setFormData({
                        ...formData, 
                        discountType: type.id, 
                        blockTitle: discountTitles[type.id], 
                        offers: discountTemplates[type.id],
                        blockTitleColor: styleTemplates[type.id].blockTitleColor,
                        offerTitleColor: styleTemplates[type.id].offerTitleColor,
                        discountLabelColor: styleTemplates[type.id].discountLabelColor,
                        priceTitleColor: styleTemplates[type.id].priceTitleColor,
                        cpriceTitleColor: styleTemplates[type.id].cpriceTitleColor,
                        tagTitleColor: styleTemplates[type.id].tagTitleColor,
                        tagBackgroundColor: styleTemplates[type.id].tagBackgroundColor,
                        footerTitleColor: styleTemplates[type.id].footerTitleColor,
                        optionBorderColor: styleTemplates[type.id].optionBorderColor,
                        optionBackgroundColor: styleTemplates[type.id].optionBackgroundColor,
                        optionNonSelectedBackgroundColor: styleTemplates[type.id].optionNonSelectedBackgroundColor
                      })}
                    as="button"
                  >
                    <BlockStack gap="400">
                      <img
                        src={type.image}
                        alt={type.title}
                        style={{ width: "100%", height: "300px" }}
                      />
                      <Text variant="headingSm" as="h3">{type.title}</Text>
                      <Text variant="bodyMd" as="p">{type.description}</Text>
              
                    </BlockStack>
                  </Box>
                
              ))}
              </div>
           
                            </BlockStack>
                         
                          
                          </Modal>
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            opacity: detailsModal2 ? "1" : "0",
                            zIndex: detailsModal2 ? "1000" : "-1",
                            width: "100%",
                            margin: "0 auto",
                            right: "0",
                            transition: "0.3s ease all",
                            boxShadow: "0 1.25rem 1.25rem -.5rem #1a1a1a47",
                          }}
                          className="overlay"
                        >
                          <Card>
                            <BlockStack gap="600">
                              <BlockStack gap="400">
                              <Text variant="headingMd" as="h6">
                                Apply Offer To
                              </Text>
                              <Box>
                  <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <RadioButton
                      label="Products"
                      checked={formData.applyTo === "PRODUCTS"}
                      id="products-radio"
                      name="apply-to"
                      onChange={() => setFormData(prev => ({ 
                        ...prev, 
                        applyTo: "PRODUCTS", 
                        selections: [] 
                      }))}
                    />
                    
                    <RadioButton
                      label="Collections"
                      checked={formData.applyTo === "COLLECTIONS"}
                      id="collections-radio"
                      name="apply-to"
                      onChange={() => setFormData(prev => ({ 
                        ...prev, 
                        applyTo: "COLLECTIONS", 
                        selections: [] 
                      }))}
                    />
                  </div>
                              </Box>
                              {formData.applyTo === "PRODUCTS" && (
                                    <BlockStack gap="300">
                                      <Button variant='primary' onClick={handleProductsPicker}>
                                        Select Products {formData.selections.length > 0 ? `(${formData.selections.length} selected)` : ''}
                                      </Button>
                                      {formData.selections.length > 0 && (
                                        <Box padding="300" background="bg-subdued" borderRadius="100">
                                          <BlockStack gap="300">
                                  <ResourceList
                                    resourceName={{
                                      singular: 'Product',
                                      plural: 'Products'
                                    }}
                                    items={formData.selections}
                                    renderItem={(product) => (
                                      <ResourceItem
                                        id={product.id}
                                        accessibilityLabel={product.title}
                                        media={
                                          <Avatar
                                            customer
                                            size="md"
                                            name={product.title}
                                            source={product.image?.originalSrc || product.image?.url}
                                          />
                                        }
                                      >
                                        <InlineStack align="space-between">
                                          <BlockStack>
                                            <Text variant="bodyMd" fontWeight="bold">
                                              {product.title}
                                            </Text>
                                          </BlockStack>
                                          <Button
                                            icon={DeleteIcon}
                                            tone="critical"
                                            onClick={() => handleDeleteSelection(product.id)}
                                          />
                                        </InlineStack>
                                      </ResourceItem>
                                    )}
                                  />
                              </BlockStack>
                                        </Box>
                                      )}
                                    </BlockStack>
                              )}
                              {formData.applyTo === "COLLECTIONS" && (
                                    <BlockStack gap="300">
                                      <Button  variant='primary' onClick={handleCollectionsPicker}>
                                        Select Collection
                                      </Button>
                                      {formData.selections.length > 0 && (
                                      
                                          <ResourceItem
                                            id={formData.selections[0].id}
                                            accessibilityLabel={formData.selections[0].title}
                                            media={
                                              <Avatar customer size="md" name={formData.selections[0].title} />
                                            }
                                          >
                                            <InlineStack align="space-between">
                                              <BlockStack>
                                                <Text variant="bodyMd" fontWeight="bold">
                                                  {formData.selections[0].title}
                                                </Text>
                                                <Text variant="bodySm" color="subdued">
                                                {formData.selections[0].productsCount}
                                                </Text>
                                              </BlockStack>
                                              <Button
                                                icon={DeleteIcon}
                                                tone="critical"
                                                onClick={() => handleDeleteSelection(formData.selections[0].id)}
                                              />
                                            </InlineStack>
                                          </ResourceItem>
                                      
                                      )}
                                    </BlockStack>
                              )}
                              </BlockStack>
                              <InlineStack gap="200" align="end">
                                <Button onClick={handleDetailsModal2}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleDetailsModal2}
                                  variant="primary"
                                >
                                  Save
                                </Button>
                              </InlineStack>
                            </BlockStack>
                          </Card>
                        </div>
                        <div
                          onClick={handleDetailsModal}
                          style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Text variant="bodySm" as="p" fontWeight="medium">
                              Offer Name
                            </Text>
                            <Icon source={EditIcon}></Icon>
                          </div>

                          <Text variant="headingXs" as="h6">
                             {formData.offerName}
                          </Text>
                        </div>
                        <div
                          onClick={handleDetailsModal2}
                          style={{ cursor: "pointer",display: "flex", flexDirection: "column", gap: "5px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Text variant="bodySm" as="p" fontWeight="medium">
                              Offer Applied On
                            </Text>
                            <Icon source={EditIcon}></Icon>
                          </div>

                          <Text variant="headingXs" as="h6">
                            {formData.applyTo === "PRODUCTS" ? "Products ": "Collections" } Selected <Badge tone="success">{formData.selections.length}</Badge>
                          </Text>
                        </div>
                        <div
                          onClick={handleDetailsModal3}
                          style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px"}}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Text variant="bodySm" as="p" fontWeight="medium">
                              Selected Template
                            </Text>
                            <Icon source={EditIcon}></Icon>
                          </div>

                          <Text variant="headingXs" as="h6">
                             
                              <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                  {icon.svg}
                                  <span style={{color: icon.color}}>{icon.text}</span>
                              </div>
                            
                          </Text>
                        </div>
                      </>
                    </div>
                  {errors.selections &&  <InlineError message={errors.selections}/>}  
                  {errors.offerName && <InlineError message={errors.offerName}/>}
                  </BlockStack>
                  </Box>
                  <Box
                    padding="400"
                    background="bg-surface"
                    borderRadius="200"
                    shadow="200"
                    borderColor="#dedede"
                    borderStyle="solid"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "50px",
                      }}
                    >
                      <>
                        
                        <div
                          
                          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              width: "fit-content"
                            }}
                          >
                            <Text variant="bodySm" as="p" fontWeight="medium">
                              Template Layout
                            </Text>
                            <Icon source={EditIcon}></Icon>
                          </div>

                          <div style={{ display: 'flex', gap: '16px' }}>
                            <div
                              role="button"
                              onClick={() => handleLayoutChange('vertical')}
                              style={{
                                padding: '5px',
                                border: `2px solid ${formData.layout === 'vertical' ? '#000000' : '#e1e3e5'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="4" y="4" width="16" height="4" fill={formData.layout === 'vertical' ? '#000000' : '#8c9196'} />
                                <rect x="4" y="10" width="16" height="4" fill={formData.layout === 'vertical' ? '#000000' : '#8c9196'} />
                                <rect x="4" y="16" width="16" height="4" fill={formData.layout === 'vertical' ? '#000000' : '#8c9196'} />
                              </svg>
                              <Text variant="bodySm" as="p" fontWeight={formData.layout === 'vertical' ? 'bold' : 'regular'}>
                                Vertical
                              </Text>
                            </div>

                            <div
                              role="button"
                              onClick={() => handleLayoutChange('horizontal')}
                              style={{
                                padding: '5px',
                                border: `2px solid ${formData.layout === 'horizontal' ? '#000000' : '#e1e3e5'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="6" width="6" height="12" fill={formData.layout === 'horizontal' ? '#000000' : '#8c9196'} />
                                <rect x="9" y="6" width="6" height="12" fill={formData.layout === 'horizontal' ? '#000000' : '#8c9196'} />
                                <rect x="16" y="6" width="6" height="12" fill={formData.layout === 'horizontal' ? '#000000' : '#8c9196'} />
                              </svg>
                              <Text variant="bodySm" as="p" fontWeight={formData.layout === 'horizontal' ? 'bold' : 'regular'}>
                                Horizontal
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div
                         
                          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              width: "fit-content"
                            }}
                          >
                            <Text variant="bodySm" as="p" fontWeight="medium">
                              Choose a Theme
                            </Text>
                            <Icon source={EditIcon}></Icon>
                          </div>

                          <div style={{ display: 'flex', gap: '16px' }}>
                        {formData.layout === 'vertical' ? (
                             // Vertical themes
                                <>
                                <div
                                  role="button"
                                  onClick={() => handleThemeChange('theme1')}
                                  style={{
                                    padding: '5px',
                                    border: `2px solid ${selectedTheme === 'theme1' ? themeColors.theme1.border : '#e1e3e5'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedTheme === 'theme1' ? themeColors.theme1.background : '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect width="24" height="8" fill={selectedTheme === 'theme1' ? themeColors.theme1.fill : '#8c9196'} />
                                    <rect y="10" width="24" height="8" fill={selectedTheme === 'theme1' ? themeColors.theme1.fill : '#8c9196'} />
                                    <rect y="20" width="24" height="4" fill={selectedTheme === 'theme1' ? themeColors.theme1.fill : '#8c9196'} />
                                  </svg>
                                </div>

                                <div
                                  role="button"
                                  onClick={() => handleThemeChange('theme2')}
                                  style={{
                                    padding: '5px',
                                    border: `2px solid ${selectedTheme === 'theme2' ? themeColors.theme2.border : '#e1e3e5'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedTheme === 'theme2' ? themeColors.theme2.background : '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                   
                                  }}
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect width="24" height="6" fill={selectedTheme === 'theme2' ? themeColors.theme2.fill : '#8c9196'} />
                                    <rect y="8" width="24" height="6" fill={selectedTheme === 'theme2' ? themeColors.theme2.fill : '#8c9196'} />
                                    <rect y="16" width="24" height="6" fill={selectedTheme === 'theme2' ? themeColors.theme2.fill : '#8c9196'} />
                                  </svg>
                                  
                                </div>

                                <div
                                  role="button"
                                  onClick={() => handleThemeChange('theme3')}
                                  style={{
                                    padding: '5px',
                                    border: `2px solid ${selectedTheme === 'theme3' ? themeColors.theme3.border : '#e1e3e5'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedTheme === 'theme3' ? themeColors.theme3.background : '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                    <rect y="6" width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                    <rect y="12" width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                    <rect y="18" width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                  </svg>
                                </div>
                                </>
                           ) : (
                              // Horizontal theme
                                <div
                                  role="button"
                                  onClick={() => handleThemeChange('horizontal1')}
                                  style={{
                                    padding: '5px',
                                    border: `2px solid ${selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#e1e3e5'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedTheme === 'horizontal1' ? formData.optionBackgroundColor : '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="0" y="8" width="8" height="8" fill={selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#8c9196'} />
                                    <rect x="10" y="8" width="8" height="8" fill={selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#8c9196'} />
                                    <rect x="20" y="8" width="8" height="8" fill={selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#8c9196'} />
                                  </svg>
                                </div>
                              )}
                          </div>
                        </div>
                       
                      </>
                    </div>
                  </Box>
          
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Offers</Text>
              
              {formData.offers.map((offer, index) => (
                <Card key={index}>
                  <div style={{ position: 'relative' }}>
                    {formData.offers.length > 1 && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '-11px', 
                        right: '-10px', 
                        zIndex: 1 
                      }}>
                        <Button
                          icon={XIcon}
                          size="micro"
                          tone="critical"
                          onClick={() => handleDeleteOffer(index)}
                          accessibilityLabel="Delete offer"
                        />
                      </div>
                    )}
                    
                    <BlockStack gap="400">
                      {/* Discount Settings */}
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <Select
                            label="Type of Discount"
                            options={[
                              {label: `Percentage Discount (e.g. 10% off)`, value: 'percentage'},
                              {label: `Flat Discount (e.g. ${currencySymbol}10 off)`, value: 'flat'},
                              {label: `Flat Discount Per Item (e.g. ${currencySymbol}10 off on each item)`, value: 'flat-per-item'},
                              {label: `Fixed Price (e.g. ${currencySymbol}10 )`, value: 'fixed'}
                            ]}
                            value={offer.discountType}
                            error={errors.offers?.[index]?.discountType}
                            onChange={(value) => {
                              const newOffers = [...formData.offers];
                              newOffers[index].discountType = value;
                              setFormData({...formData, offers: newOffers});
                            }}
                          />
                         
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <TextField
                            label="Discount Value"
                            type="number"
                            value={offer.discountValue}
                            error={errors.offers?.[index]?.discountValue}
                            onChange={(value) => {
                              const newOffers = [...formData.offers];
                              newOffers[index].discountValue = value;
                              setFormData({...formData, offers: newOffers});
                            }}
                          />
                        </Grid.Cell>
                      </Grid>

                      {/* Offer Details */}
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <TextField
                            label="Quantity"
                            min={1}
                            type="number"
                            value={offer.quantity}
                            error={errors.offers?.[index]?.quantity}
                            onChange={(value) => {
                              const newOffers = [...formData.offers];
                              newOffers[index].quantity = value;
                              setFormData({...formData, offers: newOffers});
                            }}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <TextField
                            label="Offer Title"
                            value={offer.offerTitle}
                            error={errors.offers?.[index]?.offerTitle}
                            onChange={(value) => {
                              const newOffers = [...formData.offers];
                              newOffers[index].offerTitle = value;
                              setFormData({...formData, offers: newOffers});
                            }}
                          />
                        </Grid.Cell>
                      </Grid>

                      <Grid>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <TextField
                            label="Discount Label"
                            value={offer.discountLabel}
                            onChange={(value) => {
                              const newOffers = [...formData.offers];
                              newOffers[index].discountLabel = value;
                              setFormData({...formData, offers: newOffers});
                            }}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <TextField
                            label="Tag"
                            value={offer.tag}
                            onChange={(value) => {
                              const newOffers = [...formData.offers];
                              newOffers[index].tag = value;
                              setFormData({...formData, offers: newOffers});
                            }}
                          />
                        </Grid.Cell>
                      </Grid>
                      <RadioButton
                          label="Set as Default Offer"
                          checked={offer.active}
                          onChange={() => handleActiveOfferChange(index)}
                        />
                    </BlockStack>
                  </div>
                </Card>
              ))}

              <Button
                onClick={() => {
                  if (formData.offers.length < 6) {
                    setFormData({
                      ...formData,
                      offers: [...formData.offers, {
                        discountType: 'percentage',
                        discountValue: '',
                        quantity: '',
                        offerTitle: '',
                        discountLabel: '',
                        tag: ''
                      }]
                    });
                  }
                }}
                disabled={formData.offers.length >= 6}
                variant="primary"
              >
                Add Offer
              </Button>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Layout Settings</Text>
              <TextField
                label="Block Title"
                value={formData.blockTitle}
                onChange={(value) => setFormData({...formData, blockTitle: value})}
              />
              <Grid>
                <Grid.Cell columnSpan={{xs: 6}}>
                        <TextField
                            label="Footer Text Line 1"
                            value={formData.footerText1}
                            onChange={(value) => setFormData({...formData, footerText1: value})}
                        />
                </Grid.Cell>
              <Grid.Cell columnSpan={{xs: 6}}>
                <TextField
                    label="Footer Text Line 2"
                    value={formData.footerText2}
                    onChange={(value) => setFormData({...formData, footerText2: value})}
                />
                </Grid.Cell>
            </Grid>
            </BlockStack>
          </Card>

          {/* Settings */}

          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h2">Settings</Text>
                  <Checkbox
                  label="Show each unit price"
                  checked={formData.settings.showUnitPrice}
                  onChange={(checked) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, showUnitPrice: checked }
                  }))}
                />
                 {formData.settings.showUnitPrice && (
                  <TextField
                    value={formData.settings.unitPriceLabel}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, unitPriceLabel: value }
                    }))}
                    autoComplete="off"
                  />
                 )}
      
                <Checkbox
                  label="Show total price"
                  checked={formData.settings.showTotalPrice}
                  onChange={(checked) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, showTotalPrice: checked }
                  }))}
                />
      
                <Checkbox
                  label="Let customers choose different variants for each item"
                  checked={formData.settings.allowVariants}
                  disabled={formData.layout !== 'vertical'}
                  onChange={(checked) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allowVariants: checked }
                  }))}
                />
      
                <Checkbox
                  label="Display widget below add to cart button"
                  checked={formData.settings.displayBelowCart}
                  onChange={(checked) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, displayBelowCart: checked }
                  }))}
                />
      
                <Checkbox
                  label="Skip cart directly to checkout"
                  checked={formData.settings.skipCart}
                  onChange={(checked) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, skipCart: checked }
                  }))}
                />
      
                <Checkbox
                  label="Show compare to price"
                  checked={formData.settings.showComparePrice}
                  onChange={(checked) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, showComparePrice: checked }
                  }))}
                />
            </BlockStack>
          </Card>

          {/* CSS Settings */}
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Style Settings</Text>
              
              {/* Block Title Styling */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Block Title Style</Text>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <RangeSlider
                        label="Size"
                        value={formData.blockTitleSize}
                        onChange={(value) => setFormData({...formData, blockTitleSize: value})}
                        min={12}
                        max={32}
                        step={1}
                        suffix={formData.blockTitleSize + 'px'}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <Select
                        label="Style"
                        options={[
                          {label: 'Normal', value: 'normal'},
                          {label: 'Bold', value: 'bold'},
                          {label: 'Italic', value: 'italic'}
                        ]}
                        value={formData.blockTitleStyle}
                        onChange={(value) => setFormData({...formData, blockTitleStyle: value})}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Color</Text>
                        <input
                          type="color"
                          value={formData.blockTitleColor}
                          onChange={(e) => setFormData({...formData, blockTitleColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>

              {/* Offer Title Styling */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Offer Title Style</Text>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <RangeSlider
                        label="Size"
                        value={formData.offerTitleSize}
                        onChange={(value) => setFormData({...formData, offerTitleSize: value})}
                        min={10}
                        max={24}
                        step={1}
                        suffix={formData.offerTitleSize + 'px'}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <Select
                        label="Style"
                        options={[
                          {label: 'Normal', value: 'normal'},
                          {label: 'Bold', value: 'bold'},
                          {label: 'Italic', value: 'italic'}
                        ]}
                        value={formData.offerTitleStyle}
                        onChange={(value) => setFormData({...formData, offerTitleStyle: value})}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Color</Text>
                        <input
                          type="color"
                          value={formData.offerTitleColor}
                          onChange={(e) => setFormData({...formData, offerTitleColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>

              {/* Price Styling */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Price Style</Text>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <RangeSlider
                        label="Size"
                        value={formData.priceTitleSize}
                        onChange={(value) => setFormData({...formData, priceTitleSize: value})}
                        min={8}
                        max={20}
                        step={1}
                        suffix={formData.priceTitleSize + 'px'}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <Select
                        label="Style"
                        options={[
                          {label: 'Normal', value: 'normal'},
                          {label: 'Bold', value: 'bold'},
                          {label: 'Italic', value: 'italic'}
                        ]}
                        value={formData.priceTitleStyle}
                        onChange={(value) => setFormData({...formData, priceTitleStyle: value})}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Color</Text>
                        <input
                          type="color"
                          value={formData.priceTitleColor}
                          onChange={(e) => setFormData({...formData, priceTitleColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>

              {/* Compare Price Styling */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Compare Price Style</Text>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <RangeSlider
                        label="Size"
                        value={formData.cpriceTitleSize}
                        onChange={(value) => setFormData({...formData, cpriceTitleSize: value})}
                        min={6}
                        max={16}
                        step={1}
                        suffix={formData.cpriceTitleSize + 'px'}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <Select
                        label="Style"
                        options={[
                          {label: 'Normal', value: 'normal'},
                          {label: 'Bold', value: 'bold'},
                          {label: 'Italic', value: 'italic'}
                        ]}
                        value={formData.cpriceTitleStyle}
                        onChange={(value) => setFormData({...formData, cpriceTitleStyle: value})}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Color</Text>
                        <input
                          type="color"
                          value={formData.cpriceTitleColor}
                          onChange={(e) => setFormData({...formData, cpriceTitleColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>

              {/* Tag Styling */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Tag Style</Text>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 3}}>
                      <RangeSlider
                        label="Size"
                        value={formData.tagTitleSize}
                        onChange={(value) => setFormData({...formData, tagTitleSize: value})}
                        min={8}
                        max={16}
                        step={1}
                        suffix={formData.tagTitleSize + 'px'}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 3}}>
                      <Select
                        label="Style"
                        options={[
                          {label: 'Normal', value: 'normal'},
                          {label: 'Bold', value: 'bold'},
                          {label: 'Italic', value: 'italic'}
                        ]}
                        value={formData.tagTitleStyle}
                        onChange={(value) => setFormData({...formData, tagTitleStyle: value})}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 3}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Text Color</Text>
                        <input
                          type="color"
                          value={formData.tagTitleColor}
                          onChange={(e) => setFormData({...formData, tagTitleColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 3}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Background</Text>
                        <input
                          type="color"
                          value={formData.tagBackgroundColor}
                          onChange={(e) => setFormData({...formData, tagBackgroundColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>

              {/* Footer Styling */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Footer Style</Text>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <RangeSlider
                        label="Size"
                        value={formData.footerTitleSize}
                        onChange={(value) => setFormData({...formData, footerTitleSize: value})}
                        min={8}
                        max={20}
                        step={1}
                        suffix={formData.footerTitleSize + 'px'}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <Select
                        label="Style"
                        options={[
                          {label: 'Normal', value: 'normal'},
                          {label: 'Bold', value: 'bold'},
                          {label: 'Italic', value: 'italic'}
                        ]}
                        value={formData.footerTitleStyle}
                        onChange={(value) => setFormData({...formData, footerTitleStyle: value})}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 4}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Color</Text>
                        <input
                          type="color"
                          value={formData.footerTitleColor}
                          onChange={(e) => setFormData({...formData, footerTitleColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>

              {/* Option Box Styling */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Option Box Style</Text>
                  <Grid>
                    <Grid.Cell columnSpan={{xs: 6}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Border Color</Text>
                        <input
                          type="color"
                          value={formData.optionBorderColor}
                          onChange={(e) => setFormData({...formData, optionBorderColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Background</Text>
                        <input
                          type="color"
                          value={formData.optionBackgroundColor}
                          onChange={(e) => setFormData({...formData, optionBackgroundColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                    </Grid>
                    <Grid>
                    <Grid.Cell columnSpan={{xs: 6}}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text variant="bodyMd" as="p">Non-Selected Background</Text>
                        <input
                          type="color"
                          value={formData.optionNonSelectedBackgroundColor}
                          onChange={(e) => setFormData({...formData, optionNonSelectedBackgroundColor: e.target.value})}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </div>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6}}>
                      <RangeSlider
                        label="Border Width"
                        value={formData.borderWidth}
                        onChange={(value) => setFormData({...formData, borderWidth: value})}
                        min={0}
                        max={5}
                        step={1}
                        suffix={formData.borderWidth + 'px'}
                      />
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>
            </BlockStack>
          </Card>
        </BlockStack>
      
      <div style={{position:'sticky', top:'10px', height: 'fit-content', width:"410px", maxWidth:"410px"}} className="sticky-card">
      
       
        <Card>
        <Text>Block Preview</Text>
          <div style={{
            backgroundColor: 'transparent',
            paddingTop: '20px' 
          }}>
          
           
              <span style={{
                color: formData.blockTitleColor,
                [formData.blockTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.blockTitleStyle,
                textAlign: 'center',
                display: 'block',
                marginBottom: '20px',
                fontSize: `${formData.blockTitleSize}px`
              }}>
                {formData.blockTitle}
              </span>
            
            <div style={{
            display: "flex",
            flexDirection: formData.layout === 'vertical' ? 'column' : 'row',
            gap: "15px",
          }}>
              {formData.offers.map((offer, index) => (
                <>
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    alignItems: 'start',
                    padding: '15px',
                    border: `${formData.borderWidth}px solid ${offer.active  ?  formData.optionBorderColor : '#ddd'}`,
                    borderRadius: `${formData.borderRadius}px`,
                    position: 'relative',
                    width:  formData.layout === 'vertical' ? '100%': '33.33%',
                    backgroundColor: offer.active ? formData.optionBackgroundColor : formData.optionNonSelectedBackgroundColor
                  }}
                >
                  <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: formData.layout === 'vertical' ? 'row':'column',
                    gap: '10px',
                    width:"100%"
                  }}
                  >
                  {/* Custom Radio */}
                  <div style={{
                    width: '17px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${offer.active ? formData.optionBorderColor : 'grey'}`,
                    marginRight: '15px',
                    display: 'flex',
                    margin: formData.layout === 'vertical' ? '0' : '0 auto',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: offer.active ? formData.optionBorderColor : 'transparent',
                    }} />
                  </div>

                  {/* Offer Content */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexDirection: formData.layout === 'vertical' ? 'row':'column', gap: formData.layout === 'vertical' ? '0px': '10px' }}>
                    
                    <span style={{ display: 'flex', flexDirection: 'column', gap:formData.layout === 'vertical' ? '0px': '5px', alignItems:formData.layout === 'vertical' ? 'start': 'center', fontSize: `${formData.offerTitleSize}px`, color: formData.offerTitleColor, [formData.offerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.offerTitleStyle }}>
                      {offer.offerTitle}<br/>
                      <span style={{ fontSize: `${formData.priceTitleSize}px`, color: formData.priceTitleColor, [formData.priceTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.priceTitleStyle, lineHeight: '120%' }}>{currencySymbol}{calculateDiscountedPrice(offer,formData?.selections[0]?.price) > 0 ? calculateDiscountedPrice(offer,formData?.selections[0]?.price).toFixed(2) : formData?.selections[0]?.price}
                        <span style={{ fontSize: "8px" }}>{formData?.settings?.showUnitPrice && formData?.settings?.unitPriceLabel}</span>
                      </span>
                      {offer.discountValue && offer.discountValue > 0 && (
                        <span 
                          style={{ 
                            fontSize: `${formData.cpriceTitleSize}px`, 
                            color: formData.cpriceTitleColor, 
                            [formData.cpriceTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.cpriceTitleStyle, 
                            lineHeight: '120%', 
                            textDecoration: 'line-through'
                          }}
                        >
                         {formData?.settings?.showComparePrice && (
                            currencySymbol + 
                            (offer.quantity * formData?.selections[0]?.price > 0 
                              ? (offer.quantity * formData?.selections[0]?.price).toFixed(2) 
                              : formData?.selections[0]?.price
                            )
                          )}
                        </span>
                      )}
                    </span>
        
                    <div style={{display:'flex', flexDirection:'column', alignItems: 'center'}}>
                    {offer.tag && (
                    <div style={{
                      backgroundColor: formData.tagBackgroundColor,
                      color: formData.tagTitleColor,
                      padding: '2px 4px',
                      lineHeight: '10px',
                      borderRadius: '4px',
                      fontSize: `${formData.tagTitleSize}px`,
                      [formData.tagTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.tagTitleStyle
                    }}>
                      {offer.tag}
                    </div>
                  )}
                    {/* Prices */}
                    <div>
                      <span style={{ fontSize: `${formData.discountLabelSize}px`, color: formData.discountLabelColor, [formData.discountLabelStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.discountLabelStyle }} >
                         {offer.discountLabel}
                      </span>
                    </div>
                    </div>
                  </div>

                  </div>

                 {/* Offer Variants */}
                 <div style={{width: "100%"}}>
                 {formData?.settings?.allowVariants && 
                      formData?.applyTo === 'PRODUCTS' && 
                      formData?.selections[0]?.options?.length > 0 && 
                      offer?.quantity && 
                      parseInt(offer.quantity) > 0 && formData?.layout === 'vertical' && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          counterReset: 'item'
                        }}>
                        {[...Array(parseInt(offer?.quantity))].map((_, quantityIndex) => (
                          <div 
                            key={`quantity-${quantityIndex}`} 
                            style={{
                              display: 'flex',
                              gap: '8px',
                              padding: '4px 0',
                              position: 'relative',
                              paddingLeft: '20px',
                              counterIncrement: 'item'
                            }}
                            className="variant-item"
                          >
                            <style>
                              {`
                                .variant-item::before {
                                  content: counter(item);
                                  position: absolute;
                                  top:7px;
                                  left: 8px;
                                  color: #637381;
                                  font-size: 9px;
                                }
                              `}
                            </style>
                            {formData?.selections[0]?.options?.map((option, optionIndex) => (
                              <select
                                key={`${quantityIndex}-${optionIndex}`}
                                label={option.name}
                                onChange={() => {}}
                                value={option.values[0]}
                                style={{
                                  padding: '3px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  border: '1px solid #d9d9d9',
                                  backgroundColor: '#fff',
                                  color: '#000',
                                  width: '100%',
                                  flex: 1
                                }}
                              >
                                {option.values.map((value, valueIndex) => (
                                  <option key={valueIndex} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </select>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div> 
                </div>
                 
                </>
              ))}
            </div>
            {(formData.footerText1 || formData.footerText2) && (
              <div style={{
                marginTop: '20px',
                textAlign: 'center',
                display: "flex",
                alignItems: "center",
                justifyContent: formData?.settings?.showTotalPrice?  "space-between": "center"
              }}>
                {formData.footerText1 && (
                      <span 
                        style={{
                          fontSize: `${formData.footerTitleSize}px`, 
                          color: formData.footerTitleColor, 
                          [formData.footerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTitleStyle
                        }}
                      >
                        {formData.footerText1}
                      </span>
                    )}
                {formData.footerText2 && formData?.settings?.showTotalPrice && (
                   <span style={{fontSize: `${formData.footerTitleSize}px`, color: formData.footerTitleColor, [formData.footerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTitleStyle}}>
                    {formData.footerText2} {currencySymbol}{calculateDiscountedPrice2(formData.offers.find(offer => offer.active === true),formData?.selections[0]?.price) > 0 ? calculateDiscountedPrice2(formData.offers.find(offer => offer.active === true),formData?.selections[0]?.price).toFixed(2) : formData?.selections[0]?.price}
                    
                    </span>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
      </div>
  );

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
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      </BlockStack>
    </Page>
  );
}
