import { Card,BlockStack,Text,TextField,Grid } from "@shopify/polaris"

export default function VolumeLayoutSettings({formData,setFormData}) {
  return (
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
  )
}
