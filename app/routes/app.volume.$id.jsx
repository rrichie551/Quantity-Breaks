import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  RadioButton,
  Button,
  Spinner,
  Text,
  BlockStack,
  Box,
  Grid,
  Icon,
  Avatar,
  ResourceItem,
  ResourceList,
  InlineStack,
  Select,
  RangeSlider
} from "@shopify/polaris";
import { DeleteIcon, XIcon,CheckIcon } from "@shopify/polaris-icons";
import { fetchShopInfo } from "../server/fetchShopInfo.server";
import {  useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useNavigate,useLoaderData,useActionData,useSubmit, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request, params }) => {
  await authenticate.admin(request);
  
  const { id } = params;
  const volume = await prisma.volume.findUnique({
    where: { id }
  });

  if (!volume) {
    throw new Response("Not Found", { status: 404 });
  }
  console.log("volume: ",volume);
  const shopInfo = await fetchShopInfo(request);
  return json({ volume: volume, currencyFormat: shopInfo.data.shop.currencyFormats.moneyFormat  });
};

export const action = async ({ request,params }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  console.log("Form Data Found: ",JSON.parse(formData.get('formData')));
  const { id } = params;
  

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = JSON.parse(formData.get('formData'));

    const volume = await prisma.volume.update({
      where: { id },
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

    return json({ success: true, volume });

  } catch (error) {
    console.error('Error creating volume discount:', error);
    return json({ error: 'Failed to create volume discount' }, { status: 500 });
  }
};

export default function EditVolumeDiscount() {
  const navigate = useNavigate();
  const action = useActionData();
  const app = useAppBridge();
  const submit = useSubmit();
  const [isLoading, setIsLoading] = useState(false);
  const data = useLoaderData();
  const prevForm = data.volume;
  const navigation = useNavigation();
  const currencyFormat = data.currencyFormat;
  const [formData, setFormData] = useState({
    offerName: prevForm?.offerName,
    applyTo: prevForm?.applyTo,
    selections: prevForm?.selections,
    discountType: prevForm?.discountType,
    status: prevForm?.status,
    offers: prevForm?.offers,
    blockTitle: prevForm?.blockTitle,
    footerText1: prevForm?.footerText1,
    footerText2: prevForm?.footerText2,
    blockTitleSize: prevForm?.blockTitleSize,
    blockTitleStyle: prevForm?.blockTitleStyle,
    blockTitleColor: prevForm?.blockTitleColor,
    offerTitleSize: prevForm?.offerTitleSize,
    offerTitleStyle: prevForm?.offerTitleStyle,
    offerTitleColor: prevForm?.offerTitleColor,
    discountLabelSize: prevForm?.discountLabelSize,
    discountLabelStyle: prevForm?.discountLabelStyle,
    discountLabelColor: prevForm?.discountLabelColor,
    priceTitleSize: prevForm?.priceTitleSize,
    priceTitleStyle: prevForm?.priceTitleStyle,
    priceTitleColor: prevForm?.priceTitleColor,
    cpriceTitleSize: prevForm?.cpriceTitleSize,
    cpriceTitleStyle: prevForm?.cpriceTitleStyle,
    cpriceTitleColor: prevForm?.cpriceTitleColor,
    tagTitleSize: prevForm?.tagTitleSize,
    tagTitleStyle: prevForm?.tagTitleStyle,
    tagTitleColor: prevForm?.tagTitleColor,
    tagBackgroundColor: prevForm?.tagBackgroundColor,
    footerTitleSize: prevForm?.footerTitleSize,
    footerTitleStyle: prevForm?.footerTitleStyle,
    footerTitleColor: prevForm?.footerTitleColor,
    optionBorderColor: prevForm?.optionBorderColor,
    optionBackgroundColor: prevForm?.optionBackgroundColor,
    optionNonSelectedBackgroundColor: prevForm?.optionNonSelectedBackgroundColor,
    borderWidth: prevForm?.borderWidth,
    borderRadius: prevForm?.borderRadius
  });
  
  const currencySymbol = currencyFormat.split('{{')[0].trim();
  useEffect(() => {
    if (action?.success) {
      app.toast.show("Discount Updated Successfully");
      setIsLoading(false);
    } else if (!action?.success) {
      setIsLoading(false);
    }
  }, [action, app]); // This will give us "Rs."

  // Updated Resource Picker handlers
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
          price: product.variants[0].price
        }));

        setFormData(prev => ({
          ...prev,
          selections: selectedProducts
        }));
      }
    } catch (error) {
      console.error("Error selecting products:", error);
      // Optionally show an error message to the user
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
            productsCount: product.productsCount
          }));

        setFormData(prev => ({
          ...prev,
          selections: selectedCollection
        }));
      }
    } catch (error) {
      console.error("Error selecting collection:", error);
      // Optionally show an error message to the user
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

  // Discount Type Options for Step 2
  const discountTypes = [
    {
        id: "basic",
        title: "Custom Discount",
        description: "Create simple quantity break discounts with fixed percentage or dollar savings.",
        image: "URL_TO_BASIC_IMAGE",
      },
      {
        id: "tiered",
        title: "Bulk Discount",
        description: "Encourage larger purchases with progressive discounts. Examples include 'Buy 2 Save 10%, Buy 4 Save 20%, Buy 6 Save 30%'.",
        image: "URL_TO_TIERED_IMAGE",
      },
      {
        id: "bxgy",
        title: "Buy X Get Y",
        description: "Offer free items when customers buy a specific quantity. Examples include 'Buy 1 Get 1 Free' or 'Buy 2 Get 2 Free'.",
        image: "URL_TO_BXGY_IMAGE",
      }
  ];

  // Handler for saving/publishing
  const handleSave = async (status) => {
    const formDataToSend = new FormData();
    console.log("formData: ",JSON.stringify(formData));
    formDataToSend.append("formData",JSON.stringify(formData));
    console.log("formDataToSend: ",formDataToSend);
    setIsLoading(true);
    submit(formDataToSend, {
      method: "post",
      encType: "multipart/form-data",
    });
    console.log("formDataToSend: ",formDataToSend);
  };


  const calculateDiscountedPrice = (offer, originalPrice) => {
    const basePrice = offer.quantity * originalPrice;
    
    switch (offer.discountType) {
      case 'percentage':
        // Subtract percentage discount from base price
        return basePrice - (basePrice * (parseFloat(offer.discountValue) / 100));
        
      case 'flat':
        // Subtract flat discount from base price
        return basePrice - parseFloat(offer.discountValue);
        
      case 'flat-per-item':
        // Subtract flat discount per item (multiply discount by quantity)
        return basePrice - (parseFloat(offer.discountValue) * offer.quantity);
        
      case 'fixed':
        // Fixed price per item (multiply fixed price by quantity)
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


  const renderStep3 = () => (
     <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px'}} className="layoutGrid">
        <BlockStack gap="500">
        <Card>
          <BlockStack gap="500">
            <FormLayout>
              <TextField
                label="Offer Name"
                value={formData.offerName}
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
          <Card>
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
                    onClick={() => setFormData({...formData, discountType: type.id})}
                    as="button"
                  >
                    <BlockStack gap="400">
                      <img
                        src={type.image}
                        alt={type.title}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <Text variant="headingSm" as="h3">{type.title}</Text>
                      <Text variant="bodyMd" as="p">{type.description}</Text>
                      {formData.discountType === type.id && (
                        <Icon source={CheckIcon} color="success" />
                      )}
                    </BlockStack>
                  </Box>
                </Grid.Cell>
              ))}
            </Grid>
          </Card>
          {/* Offers Section */}
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
                            type="number"
                            value={offer.quantity}
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
      
        <div style={{position:'sticky', top:'10px', height: 'fit-content'}} className="sticky-card">
        
        
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
                  {formData.blockTitle || 'Bundle & Save'}
                </span>
              
              <div style={{
              display: "flex",
              flexDirection: 'column',
              gap: "15px",
            }}>
                {formData.offers.map((offer, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      border: `${formData.borderWidth}px solid ${offer.active  ?  formData.optionBorderColor : '#ddd'}`,
                      borderRadius: `${formData.borderRadius}px`,
                      position: 'relative',
                      backgroundColor: offer.active ? formData.optionBackgroundColor : formData.optionNonSelectedBackgroundColor
                    }}
                  >
                    {/* Custom Radio */}
                    <div style={{
                      width: '17px',
                      height: '15px',
                      borderRadius: '50%',
                      border: `2px solid ${offer.active ? formData.optionBorderColor : 'grey'}`,
                      marginRight: '15px',
                      display: 'flex',
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      
                      <span style={{ display: 'flex', flexDirection: 'column', fontSize: `${formData.offerTitleSize}px`, color: formData.offerTitleColor, [formData.offerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.offerTitleStyle }}>
                        {offer.offerTitle || `Buy ${offer.quantity}`}<br/>
                        <span style={{ fontSize: `${formData.priceTitleSize}px`, color: formData.priceTitleColor, [formData.priceTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.priceTitleStyle, lineHeight: '120%' }}>{currencySymbol}{calculateDiscountedPrice(offer,formData.selections[0].price) > 0 ? calculateDiscountedPrice(offer,formData.selections[0].price).toFixed(2) : formData.selections[0].price.toFixed(2)}</span>
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
                            {currencySymbol}
                            {offer.quantity*formData.selections[0].price > 0 
                              ? (offer.quantity*formData.selections[0].price).toFixed(2) 
                              : formData.selections[0].price.toFixed(2)}
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
                ))}
              </div>
              {(formData.footerText1 || formData.footerText2) && (
                <div style={{
                  marginTop: '20px',
                  textAlign: 'center',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  {formData.footerText1 && (
                      <span style={{fontSize: `${formData.footerTitleSize}px`, color: formData.footerTitleColor, [formData.footerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTitleStyle}}>
                      {formData.footerText1}
                      </span>
                  )}
                  {formData.footerText2 && (
                    <span style={{fontSize: `${formData.footerTitleSize}px`, color: formData.footerTitleColor, [formData.footerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTitleStyle}}>
                      {formData.footerText2} {currencySymbol}{formData.offers[0].quantity*formData.selections[0].price}
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
    backAction={{content: 'Products', url: '/app'}}
    title={"Update "+"'"+formData.offerName+"'"}
    compactTitle
    primaryAction={{content: 'Update', onAction: () => handleSave('published')}}
    secondaryActions={[
      {
        content: 'Save as Draft',
        onAction: () => handleSave('draft')
      }
    ]}
    > 
    <div style={{marginTop: '20px'}}> 
          <BlockStack gap="800">
            {renderStep3()}
          </BlockStack>
      </div>
    </Page>
  );
}
