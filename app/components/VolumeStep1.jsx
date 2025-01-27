
import { Card,BlockStack,TextField,Text,Box,RadioButton, Button, ResourceList,ResourceItem,FormLayout,Avatar,InlineStack } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
export default function VolumeStep1({
     formData, 
     errors, 
     setFormData, 
     handleProductsPicker,
     handleCollectionsPicker, 
     handleDeleteSelection
    }) 
    {
  return (
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
  )
}
