import { Card,BlockStack,Text,Checkbox,TextField } from "@shopify/polaris"

export default function VolumeSettings({formData,setFormData}) {
  return (
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
  )
}
