import { Card,BlockStack,Text,TextField } from "@shopify/polaris"

export default function ComboUI({formData,errors,setFormData}) {
  return (
   
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">UI Text Settings</Text>
                  
                  <TextField
                    label="Call to Action Button Text"
                    value={formData.callToAction}
                    error={errors.callToAction}
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
  )
}
