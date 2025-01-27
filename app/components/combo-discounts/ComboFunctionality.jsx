
import { Card,Text,BlockStack,Checkbox } from "@shopify/polaris"
export default function ComboFunctionality({formData,setFormData}) {
  return (
  
              <Card>
                         <BlockStack gap="200">
                           <Text variant="headingMd" as="h2">Settings</Text>
                               <Checkbox
                               label="Show each unit price on product"
                               checked={formData.settings.showUnitPrice}
                               onChange={(checked) => setFormData(prev => ({
                                 ...prev,
                                 settings: { ...prev.settings, showUnitPrice: checked }
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
                               label="Show compare at price for bundle"
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
