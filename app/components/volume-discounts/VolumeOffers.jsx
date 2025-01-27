
import { Box,BlockStack,Card,Text,TextField,InlineStack,Button,RadioButton,ResourceList,ResourceItem,Avatar,Icon,InlineError,Badge } from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import {  Modal, TitleBar } from "@shopify/app-bridge-react";
import { useState,useCallback } from "react";
export default function VolumeOffers({
    formData,
    errors,
    setFormData,
    styleTemplates,
    handleProductsPicker,
    handleCollectionsPicker,
    handleDeleteSelection
}) {
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
      const icon = discountIcons[formData.discountType];

  return (
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
  )
}
