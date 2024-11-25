import { useState, useCallback, useEffect } from "react";
import {
  Page, Layout, Card, Text, BlockStack, Grid, Button,
  TextField, Select, RangeSlider, Avatar
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import { fetchShopInfo } from "../server/fetchShopInfo.server";
import { DeleteIcon } from "@shopify/polaris-icons";

// Loader and Action functions
export const loader = async ({ request, params }) => {
    await authenticate.admin(request);
  
    const { id } = params;
    const combo = await prisma.combo.findUnique({
      where: { id }
    });
  
    if (!combo) {
      throw new Response("Not Found", { status: 404 });
    }
    const shopInfo = await fetchShopInfo(request);
    return json({ combo: combo, currencyFormat: shopInfo.data.shop.currencyFormats.moneyFormat  });
};

export const action = async ({ request,params }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const { id } = params;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = JSON.parse(formData.get('formData'));

    const combo = await prisma.combo.update({
      where: { id },
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
  const [isLoading, setIsLoading] = useState(false);
  const dataLoader = useLoaderData();
  const prevForm = dataLoader.combo;
  const currencyFormat = dataLoader.currencyFormat;
  const currencySymbol = currencyFormat.split('{{')[0].trim();

  // Initial form state
  const [formData, setFormData] = useState({
    offerName: prevForm?.offerName || "",
    comboTitle: prevForm?.comboTitle || "",
    products: prevForm?.products || [],
    discountType: prevForm?.discountType || "percentage",
    discountValue: prevForm?.discountValue || "",
    callToAction: prevForm?.callToAction || "Add to Cart",
    highlightedTag: prevForm?.highlightedTag || "",
    footerText: prevForm?.footerText || "",
    // UI Customization with defaults
    titleSize: prevForm?.titleSize || 20,
    titleStyle: prevForm?.titleStyle || "normal",
    titleColor: prevForm?.titleColor || "#000000",
    productTitleSize: prevForm?.productTitleSize || 14,
    productTitleStyle: prevForm?.productTitleStyle || "normal",
    productTitleColor: prevForm?.productTitleColor || "#000000",
    priceSize: prevForm?.priceSize || 14,
    priceStyle: prevForm?.priceStyle || "normal",
    priceColor: prevForm?.priceColor || "#000000",
    totalPriceSize: prevForm?.totalPriceSize || 16,
    totalPriceStyle: prevForm?.totalPriceStyle || "bold",
    totalPriceColor: prevForm?.totalPriceColor || "#000000",
    tagSize: prevForm?.tagSize || 12,
    tagStyle: prevForm?.tagStyle || "normal",
    tagColor: prevForm?.tagColor || "#FFFFFF",
    tagBackground: prevForm?.tagBackground || "#000000",
    buttonTextSize: prevForm?.buttonTextSize || 14,
    buttonTextColor: prevForm?.buttonTextColor || "#FFFFFF",
    buttonBackground: prevForm?.buttonBackground || "#000000",
    buttonBorderRadius: prevForm?.buttonBorderRadius || 4,
    containerPadding: prevForm?.containerPadding || 20,
    productSpacing: prevForm?.productSpacing || 15,
    containerBackground: prevForm?.containerBackground || "#FFFFFF",
    containerBorderRadius: prevForm?.containerBorderRadius || 8,
    footerTextSize: prevForm?.footerTextSize || 12,
    footerTextStyle: prevForm?.footerTextStyle || 'normal',
    footerTextColor: prevForm?.footerTextColor || '#666666',
    strikePriceSize: prevForm?.strikePriceSize || 14,
    strikePriceStyle: prevForm?.strikePriceStyle || 'normal',
    strikePriceColor: prevForm?.strikePriceColor || '#999999',
    quantityInputSize: prevForm?.quantityInputSize || 8,
    quantityInputStyle: prevForm?.quantityInputStyle || 'normal',
    quantityInputColor: prevForm?.quantityInputColor || '#000000',
    quantityLabelSize: prevForm?.quantityLabelSize || 4,
    quantityLabelRadius: prevForm?.quantityLabelRadius || 4,
    quantityLabelColor: prevForm?.quantityLabelColor || '#B5B5B5',
  });

  // Product picker handler
  const handleProductsPicker = useCallback(async () => {
    try {
      const resourcePicker = await app.resourcePicker({
        type: "product",
        action: "select",
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
  const calculatePrices = () => {
    const totalPrice = formData.products.reduce((sum, product) => 
      sum + (parseFloat(product.price) * product.quantity), 0
    );
    let discountedPrice = totalPrice;

    if (!formData.discountValue || isNaN(parseFloat(formData.discountValue))) {
      return { total: totalPrice, discounted: totalPrice };
    }

    switch (formData.discountType) {
      case 'percentage':
        // Percentage off the total price
        discountedPrice = totalPrice * (1 - (parseFloat(formData.discountValue) / 100));
        break;

      case 'fixed':
        // Fixed amount off the total price
        discountedPrice = totalPrice - parseFloat(formData.discountValue);
        break;

      case 'fixed-price':
        // Set a fixed price for the entire combo
        discountedPrice = parseFloat(formData.discountValue);
        break;

      case 'flat-per-item':
        // Discount amount per item
        const totalItems = formData.products.reduce((sum, product) => sum + product.quantity, 0);
        discountedPrice = totalPrice - (parseFloat(formData.discountValue) * totalItems);
        break;

      default:
        discountedPrice = totalPrice;
    }

    // Ensure price doesn't go below 0
    discountedPrice = Math.max(0, discountedPrice);

    return {
      total: totalPrice,
      discounted: discountedPrice,
      saved: totalPrice - discountedPrice
    };
  };
  useEffect(() => {
    if (action?.success) {
      app.toast.show("Combo Created Successfully");
      setIsLoading(false);
    } else if (!action?.success) {
      setIsLoading(false);
    }
  }, [action, app])
  // Save handler
  const handleSave = async (status) => {
    const formDataToSend = new FormData();
    formDataToSend.append("formData", JSON.stringify({
      ...formData,
      status
    }));
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
      setIsLoading(false);
    } else if (!action?.success) {
      setIsLoading(false);
    }
  }, [action, app]);

  return (
    <Page>
      <BlockStack gap="800">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text variant="heading3xl" as="h2">
            Update '{formData.offerName}'
          </Text>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button loading={isLoading} variant="primary" onClick={() => handleSave('published')}>
              Update
            </Button>
          </div>
        </div>

        <Layout>
        <div style={{display:'grid', gridTemplateColumns:'2fr 2fr', gap:'20px'}} className="layoutGrid">
        
            {/* Form Fields */}
            <BlockStack gap="400">
              {/* Basic Information */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Basic Information</Text>
                  
                  <TextField
                    label="Offer Name"
                    value={formData.offerName}
                    onChange={(value) => setFormData({...formData, offerName: value})}
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="Combo Title"
                    value={formData.comboTitle}
                    onChange={(value) => setFormData({...formData, comboTitle: value})}
                    autoComplete="off"
                  />
                  
                  <Button variant="primary" onClick={handleProductsPicker}>
                    Select Products (Upto 3)
                  </Button>
                  
                  {/* Selected Products List */}
                  {formData.products.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      {formData.products.map((product, index) => (
                        <div key={product.id} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {product.image && (
                              <Avatar
                                customer
                                size="md"
                                name={product.title}
                                source={product.image?.originalSrc || product.image?.url}
                              />
                            )}
                            <span>{product.title}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <TextField
                              type="number"
                              value={product.quantity.toString()}
                              onChange={(value) => {
                                const newProducts = [...formData.products];
                                newProducts[index] = {
                                  ...product,
                                  quantity: parseInt(value) || 1
                                };
                                setFormData(prev => ({
                                  ...prev,
                                  products: newProducts
                                }));
                              }}
                              min="1"
                              style={{
                                fontSize: `${formData.quantityInputSize}px`,
                                [formData.quantityInputStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.quantityInputStyle,
                                color: formData.quantityInputColor
                              }}
                            />
                            <Button
                              icon={DeleteIcon}
                              destructive
                              onClick={() => {
                                const newProducts = formData.products.filter((_, i) => i !== index);
                                setFormData(prev => ({
                                  ...prev,
                                  products: newProducts
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </BlockStack>
              </Card>

              {/* Discount Settings */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Discount Settings</Text>
                  
                  <Select
                    label="Discount Type"
                    options={[
                      {label: 'Percentage Off', value: 'percentage'},
                      {label: 'Fixed Amount Off', value: 'fixed'},
                      {label: 'Fixed Price', value: 'fixed-price'},
                      {label: 'Per Unit Discount', value: 'flat-per-item'}
                    ]}
                    value={formData.discountType}
                    onChange={(value) => setFormData({...formData, discountType: value})}
                  />
                  
                  <TextField
                    label="Discount Value"
                    type="number"
                    value={formData.discountValue}
                    onChange={(value) => setFormData({...formData, discountValue: value})}
                    prefix={formData.discountType === 'percentage' ? '%' : currencySymbol}
                  />
                </BlockStack>
              </Card>

              {/* UI Text Settings */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">UI Text Settings</Text>
                  
                  <TextField
                    label="Call to Action Button Text"
                    value={formData.callToAction}
                    onChange={(value) => setFormData({...formData, callToAction: value})}
                  />
                  
                  <TextField
                    label="Highlighted Tag"
                    value={formData.highlightedTag}
                    onChange={(value) => setFormData({...formData, highlightedTag: value})}
                  />
                  
                  <TextField
                    label="Footer Text"
                    value={formData.footerText}
                    onChange={(value) => setFormData({...formData, footerText: value})}
                    multiline={4}
                  />
                </BlockStack>
              </Card>

              {/* UI Customization */}
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">UI Customization</Text>
                  
                  {/* Title Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Title Style</Text>
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <RangeSlider
                            label="Size"
                            value={formData.titleSize}
                            onChange={(value) => setFormData({...formData, titleSize: value})}
                            min={12}
                            max={32}
                            step={1}
                            suffix={formData.titleSize + 'px'}
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
                            value={formData.titleStyle}
                            onChange={(value) => setFormData({...formData, titleStyle: value})}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Color</Text>
                            <input
                              type="color"
                              value={formData.titleColor}
                              onChange={(e) => setFormData({...formData, titleColor: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                      </Grid>
                    </BlockStack>
                  </Card>

                  {/* Product Title Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Product Title Style</Text>
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <RangeSlider
                            label="Size"
                            value={formData.productTitleSize}
                            onChange={(value) => setFormData({...formData, productTitleSize: value})}
                            min={12}
                            max={24}
                            step={1}
                            suffix={formData.productTitleSize + 'px'}
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
                            value={formData.productTitleStyle}
                            onChange={(value) => setFormData({...formData, productTitleStyle: value})}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Color</Text>
                            <input
                              type="color"
                              value={formData.productTitleColor}
                              onChange={(e) => setFormData({...formData, productTitleColor: e.target.value})}
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
                            value={formData.priceSize}
                            onChange={(value) => setFormData({...formData, priceSize: value})}
                            min={12}
                            max={24}
                            step={1}
                            suffix={formData.priceSize + 'px'}
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
                            value={formData.priceStyle}
                            onChange={(value) => setFormData({...formData, priceStyle: value})}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Color</Text>
                            <input
                              type="color"
                              value={formData.priceColor}
                              onChange={(e) => setFormData({...formData, priceColor: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                      </Grid>
                    </BlockStack>
                  </Card>

                  {/* Total Price Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Total Price Style</Text>
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <RangeSlider
                            label="Size"
                            value={formData.totalPriceSize}
                            onChange={(value) => setFormData({...formData, totalPriceSize: value})}
                            min={14}
                            max={32}
                            step={1}
                            suffix={formData.totalPriceSize + 'px'}
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
                            value={formData.totalPriceStyle}
                            onChange={(value) => setFormData({...formData, totalPriceStyle: value})}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Color</Text>
                            <input
                              type="color"
                              value={formData.totalPriceColor}
                              onChange={(e) => setFormData({...formData, totalPriceColor: e.target.value})}
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
                            value={formData.tagSize}
                            onChange={(value) => setFormData({...formData, tagSize: value})}
                            min={10}
                            max={20}
                            step={1}
                            suffix={formData.tagSize + 'px'}
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
                            value={formData.tagStyle}
                            onChange={(value) => setFormData({...formData, tagStyle: value})}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 3}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Text Color</Text>
                            <input
                              type="color"
                              value={formData.tagColor}
                              onChange={(e) => setFormData({...formData, tagColor: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 3}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Background</Text>
                            <input
                              type="color"
                              value={formData.tagBackground}
                              onChange={(e) => setFormData({...formData, tagBackground: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                      </Grid>
                    </BlockStack>
                  </Card>

                  {/* Button Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Button Style</Text>
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 3}}>
                          <RangeSlider
                            label="Text Size"
                            value={formData.buttonTextSize}
                            onChange={(value) => setFormData({...formData, buttonTextSize: value})}
                            min={12}
                            max={24}
                            step={1}
                            suffix={formData.buttonTextSize + 'px'}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 3}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Text Color</Text>
                            <input
                              type="color"
                              value={formData.buttonTextColor}
                              onChange={(e) => setFormData({...formData, buttonTextColor: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 3}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Background</Text>
                            <input
                              type="color"
                              value={formData.buttonBackground}
                              onChange={(e) => setFormData({...formData, buttonBackground: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 3}}>
                          <RangeSlider
                            label="Border Radius"
                            value={formData.buttonBorderRadius}
                            onChange={(value) => setFormData({...formData, buttonBorderRadius: value})}
                            min={0}
                            max={20}
                            step={1}
                            suffix={formData.buttonBorderRadius + 'px'}
                          />
                        </Grid.Cell>
                      </Grid>
                    </BlockStack>
                  </Card>

                  {/* Container Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Container Style</Text>
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <RangeSlider
                            label="Product Spacing"
                            value={formData.productSpacing}
                            onChange={(value) => setFormData({...formData, productSpacing: value})}
                            min={10}
                            max={40}
                            step={1}
                            suffix={formData.productSpacing + 'px'}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6}}>
                            <RangeSlider
                            label="Container Padding"
                            value={formData.containerPadding}
                            onChange={(value) => setFormData({...formData, containerPadding: value})}
                            min={10}
                            max={40}
                            step={1}
                            suffix={formData.containerPadding + 'px'}
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Background</Text>
                            <input
                              type="color"
                              value={formData.containerBackground}
                              onChange={(e) => setFormData({...formData, containerBackground: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 6}}>
                          <RangeSlider
                            label="Border Radius"
                            value={formData.containerBorderRadius}
                            onChange={(value) => setFormData({...formData, containerBorderRadius: value})}
                            min={0}
                            max={20}
                            step={1}
                            suffix={formData.containerBorderRadius + 'px'}
                          />
                        </Grid.Cell>
                      </Grid>
                    </BlockStack>
                  </Card>

                  {/* Strike Price Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Strike Price Style</Text>
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <RangeSlider
                            label="Size"
                            value={formData.strikePriceSize}
                            onChange={(value) => setFormData({...formData, strikePriceSize: value})}
                            min={10}
                            max={24}
                            step={1}
                            suffix={formData.strikePriceSize + 'px'}
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
                            value={formData.strikePriceStyle}
                            onChange={(value) => setFormData({...formData, strikePriceStyle: value})}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Color</Text>
                            <input
                              type="color"
                              value={formData.strikePriceColor}
                              onChange={(e) => setFormData({...formData, strikePriceColor: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                      </Grid>
                    </BlockStack>
                  </Card>

                  {/* Footer Text Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Footer Text Style</Text>
                      <Grid>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <RangeSlider
                            label="Size"
                            value={formData.footerTextSize}
                            onChange={(value) => setFormData({...formData, footerTextSize: value})}
                            min={10}
                            max={20}
                            step={1}
                            suffix={formData.footerTextSize + 'px'}
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
                            value={formData.footerTextStyle}
                            onChange={(value) => setFormData({...formData, footerTextStyle: value})}
                          />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{xs: 4}}>
                          <div style={{ marginBottom: '10px' }}>
                            <Text variant="bodyMd" as="p">Color</Text>
                            <input
                              type="color"
                              value={formData.footerTextColor}
                              onChange={(e) => setFormData({...formData, footerTextColor: e.target.value})}
                              style={{ width: '100%', height: '40px' }}
                            />
                          </div>
                        </Grid.Cell>
                      </Grid>
                    </BlockStack>
                  </Card>

                  {/* Quantity Input Styling */}
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingSm" as="h3">Quantity Input Style</Text>
                      
                        <Card>
                          <Text variant="bodyMd" as="h4">Input Field</Text>
                          <Grid>
                            
                            <Grid.Cell columnSpan={{xs: 4}}>
                              <RangeSlider
                                label="Size"
                                value={formData.quantityInputSize}
                                onChange={(value) => setFormData({...formData, quantityInputSize: value})}
                                min={1}
                                max={20}
                                step={1}
                                suffix={formData.quantityInputSize + 'px'}
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
                                value={formData.quantityInputStyle}
                                onChange={(value) => setFormData({...formData, quantityInputStyle: value})}
                              />
                            </Grid.Cell>
                            
                            <Grid.Cell columnSpan={{xs: 4}}>
                              <div style={{ marginBottom: '10px' }}>
                                <Text variant="bodyMd" as="p">Color</Text>
                                <input
                                  type="color"
                                  value={formData.quantityInputColor}
                                  onChange={(e) => setFormData({...formData, quantityInputColor: e.target.value})}
                                  style={{ width: '100%', height: '40px' }}
                                />
                              </div>
                            </Grid.Cell>
                          </Grid>
                        </Card>
                        
                        <Card>
                          <Text variant="bodyMd" as="h4">Label</Text>
                          <Grid>
                            <Grid.Cell columnSpan={{xs: 4}}>
                              <RangeSlider
                                label="Size"
                                value={formData.quantityLabelSize}
                                onChange={(value) => setFormData({...formData, quantityLabelSize: value})}
                                min={1}
                                max={16}
                                step={1}
                                suffix={formData.quantityLabelSize + 'px'}
                              />
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 4}}>
                            <RangeSlider
                                label="Quantity Radius"
                                value={formData.quantityLabelRadius}
                                onChange={(value) => setFormData({...formData, quantityLabelRadius: value})}
                                min={1}
                                max={16}
                                step={1}
                                suffix={formData.quantityLabelRadius + 'px'}
                              />
                            </Grid.Cell>
                            
                            <Grid.Cell columnSpan={{xs: 4}}>
                              <div style={{ marginBottom: '10px' }}>
                                <Text variant="bodyMd" as="p">Color</Text>
                                <input
                                  type="color"
                                  value={formData.quantityLabelColor}
                                  onChange={(e) => setFormData({...formData, quantityLabelColor: e.target.value})}
                                  style={{ width: '100%', height: '40px' }}
                                />
                              </div>
                            </Grid.Cell>
                          </Grid>
                        </Card>
                     
                    </BlockStack>
                  </Card>
                </BlockStack>
              </Card>
            </BlockStack>
         
          {/* Preview Section */}
         
            <div style={{position: 'sticky', top: '20px', height:'fit-content'}}>
              <Card>
                <Text variant="headingMd" as="h2">Preview</Text>
                <div style={{
                  backgroundColor: formData.containerBackground,
                  borderRadius: `${formData.containerBorderRadius}px`,
                  padding: `${formData.containerPadding}px`,
                  marginTop: '20px'
                }}>
                  <div style={{
                    backgroundColor: formData.containerBackground,
                    borderRadius: `${formData.containerBorderRadius}px`
                    }}>
                    {/* Title */}
                    <div style={{
                        [formData.titleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.titleStyle,
                        fontSize: `${formData.titleSize}px`,
                        color: formData.titleColor,
                        textAlign: 'center',
                        marginBottom: '20px'
                    }}>
                        {formData.comboTitle || 'Bundle & Save'}
                    </div>

                    {/* Products Stack in Preview */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${formData.productSpacing}px`
                    }}>
                        {formData.products.map((product, index) => (
                        <div key={product.id}>
                            <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                            }}>
                            {product.image && (
                                <img 
                                src={product.image?.originalSrc || product.image?.url} 
                                alt={product.title}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover'
                                }}
                                />
                            )}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{
                                    [formData.productTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.productTitleStyle,
                                    fontSize: `${formData.productTitleSize}px`,
                                    color: formData.productTitleColor
                                    }}>
                                    {product.title}
                                    </span>
                                    <span style={{
                                    [formData.quantityInputStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.quantityLabelStyle,
                                    fontSize: `${formData.quantityInputSize}px`,
                                    color: formData.quantityInputColor,
                                    backgroundColor: formData.quantityLabelColor,
                                    borderRadius: `${formData.quantityLabelRadius}px`,
                                    padding: `${formData.quantityLabelSize}px`,
                                    display: 'block',
                                    lineHeight: '120%',
                                    width: 'fit-content',
                                    }}>
                                    x {product.quantity}
                                    </span>
                                </div>
                                <span style={{
                                [formData.priceStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.priceStyle,
                                fontSize: `${formData.priceSize}px`,
                                color: formData.priceColor
                                }}>
                                {currencySymbol}{(product.price * product.quantity).toFixed(2)}
                                </span>
                            </div>
                            </div>
                            {index < formData.products.length - 1 && (
                            <div style={{
                                textAlign: 'center',
                                margin: '10px 0',
                                fontSize: '20px',
                                color: formData.titleColor
                            }}>
                                +
                            </div>
                            )}
                        </div>
                        ))}
                    </div>

                    {/* Total Section */}
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                        {formData.highlightedTag && (
                            <div style={{
                            backgroundColor: formData.tagBackground,
                            color: formData.tagColor,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            [formData.tagStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.tagStyle,
                            fontSize: `${formData.tagSize}px`,
                            marginBottom: '8px'
                            }}>
                            {formData.highlightedTag}
                            </div>
                        )}
                        <div style={{
                            [formData.totalPriceStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.totalPriceStyle,
                            fontSize: `${formData.totalPriceSize}px`,
                            color: formData.totalPriceColor
                        }}>
                            {formData.discountValue && (
                            <span style={{
                                textDecoration: 'line-through',
                                [formData.strikePriceStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.strikePriceStyle,
                                color: formData.strikePriceColor,
                                marginRight: '8px',
                                fontSize: `${formData.strikePriceSize}px`
                            }}>
                                {currencySymbol}{calculatePrices().total.toFixed(2)}
                            </span>
                            )}
                            {currencySymbol}{calculatePrices().discounted.toFixed(2)}
                            
                        </div>
                        </div>
                        
                        <button style={{
                        backgroundColor: formData.buttonBackground,
                        color: formData.buttonTextColor,
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: `${formData.buttonBorderRadius}px`,
                        fontSize: `${formData.buttonTextSize}px`,
                        cursor: 'pointer'
                        }}>
                        {formData.callToAction || 'Add to Cart'}
                        </button>
                    </div>

                    {/* Footer Text */}
                    {formData.footerText && (
                        <div style={{
                        marginTop: '15px',
                        textAlign: 'center',
                        color: formData.footerTextColor,
                        [formData.footerTextStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTextStyle,
                        fontSize: `${formData.footerTextSize}px`
                        }}>
                        {formData.footerText}
                        </div>
                    )}
                    </div>
                </div>
              </Card>
            </div>
         
          </div>
        </Layout>
      </BlockStack>
    </Page>
  );
}
