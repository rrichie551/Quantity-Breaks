
import { Card,BlockStack,Text,Grid,Box } from "@shopify/polaris";

export default function VolumeStep2({formData,setFormData}) {

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
      const styleTemplates = {
        basic: {
          blockTitleColor: '#71c280',
          offerTitleColor: '#25c16e',
          discountLabelColor: '#1c221e',
          priceTitleColor: '#776365',
          cpriceTitleColor: '#c7979a',
          tagTitleColor: '#FFFFFF',
          tagBackgroundColor: '#51cc7e',
          footerTitleColor: '#5ec47a',
          optionBorderColor: '#5ec47a',
          optionBackgroundColor: '#d7ffdb',
          optionNonSelectedBackgroundColor: '#ffffff'
        },
        tiered: {
          blockTitleColor: '#fd7a75',
          offerTitleColor: '#fd7a75',
          discountLabelColor: '#1c221e',
          priceTitleColor: '#836161',
          cpriceTitleColor: '#808080',
          tagTitleColor: '#FFFFFF',
          tagBackgroundColor: '#fd7a75',
          footerTitleColor: '#fd7a75',
          optionBorderColor: '#fd7a75',
          optionBackgroundColor: '#f5e5e6',
          optionNonSelectedBackgroundColor: '#ffffff'
        },
        bxgy: {
          blockTitleColor: '#1c221e',
          offerTitleColor: '#000000',
          discountLabelColor: '#1c221e',
          priceTitleColor: '#000000',
          cpriceTitleColor: '#808080',
          tagTitleColor: '#FFFFFF',
          tagBackgroundColor: '#1c221e',
          footerTitleColor: '#1c221e',
          optionBorderColor: '#1c221e',
          optionBackgroundColor: '#ffffff',
          optionNonSelectedBackgroundColor: '#ffffff'
        }
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
  return (
     <Card>
             <BlockStack gap="500">
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
                   </Grid.Cell>
                 ))}
               </Grid>
             </BlockStack>
           </Card>
  )
}
