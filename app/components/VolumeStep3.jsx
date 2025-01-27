
import { BlockStack } from "@shopify/polaris";
import VolumeOffers from "./volume-discounts/VolumeOffers";
import VolumeLayout from "./volume-discounts/VolumeLayout";
import VolumeConfig from "./volume-discounts/VolumeConfig";
import VolumeLayoutSettings from "./volume-discounts/VolumeLayoutSettings";
import VolumeSettings from "./volume-discounts/VolumeSettings";
import VolumeDesign from "./volume-discounts/VolumeDesign";

import VolumeBlock from "./VolumeBlock";

export default function VolumeStep3({
    formData,
    setFormData,
    errors,
    handleProductsPicker,
    handleCollectionsPicker,
    currencyFormat,
    handleDeleteSelection
}) {
     
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
    
      const currencySymbol = currencyFormat.split('{{')[0].trim();    
           
  return (
     <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px'}} className="layoutGrid">
            <BlockStack gap="500">
              {/* Offers Section */}
             
                  <VolumeOffers
                    formData={formData}
                    errors={errors}
                    setFormData={setFormData}
                    styleTemplates={styleTemplates}
                    handleProductsPicker={handleProductsPicker}
                    handleCollectionsPicker={handleCollectionsPicker}
                    handleDeleteSelection={handleDeleteSelection}
                  />

                  <VolumeLayout
                    formData={formData}
                    setFormData={setFormData}
                    styleTemplates={styleTemplates}
                  />
                     
                  <VolumeConfig
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    currencySymbol={currencySymbol}
                  />
             
            
                  <VolumeLayoutSettings
                    formData={formData}
                    setFormData={setFormData}
                  />

                  <VolumeSettings
                    formData={formData}
                    setFormData={setFormData}
                  />
    
             
                  <VolumeDesign
                    formData={formData}
                    setFormData={setFormData}
                  />

             
            </BlockStack>
              <VolumeBlock
                  formData={formData}
                  currencySymbol={currencySymbol}
                  
              />
         
          </div>
  )
}
