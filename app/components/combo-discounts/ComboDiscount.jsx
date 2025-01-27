
import { Card,BlockStack,Select,TextField,Text } from "@shopify/polaris"
export default function ComboDiscount({formData,errors,setFormData,currencySymbol}) {
  return (
  
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
                    error={errors.discountValue}
                    onChange={(value) => setFormData({...formData, discountValue: value})}
                    prefix={formData.discountType === 'percentage' ? '%' : currencySymbol}
                  />
                </BlockStack>
              </Card>
  )
}
