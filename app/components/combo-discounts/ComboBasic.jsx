
import { Card,BlockStack,Text,TextField,Button,InlineError,Avatar } from "@shopify/polaris";
import {DeleteIcon} from "@shopify/polaris-icons";

export default function ComboBasic({formData,errors,setFormData,handleProductsPicker}) {
  return (
   
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Basic Information</Text>
                  
                  <TextField
                    label="Offer Name"
                    value={formData.offerName}
                    error={errors.offerName}
                    onChange={(value) => setFormData({...formData, offerName: value})}
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="Combo Title"
                    value={formData.comboTitle}
                    error={errors.comboTitle}
                    onChange={(value) => setFormData({...formData, comboTitle: value})}
                    autoComplete="off"
                  />
                  
                  <Button variant="primary" onClick={handleProductsPicker}>
                    Select Products (Upto 3)
                  </Button>
                  <InlineError message={errors.products} fieldID="myFieldID" />
    
                  
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
  )
}
