import { BlockStack} from "@shopify/polaris";
import ComboBlock from "./ComboBlock";
import ComboBasic from "./combo-discounts/ComboBasic";
import ComboDiscount from "./combo-discounts/ComboDiscount";
import ComboFunctionality from "./combo-discounts/ComboFunctionality";
import ComboUI from "./combo-discounts/ComboUI";
import ComboUICustomization from "./combo-discounts/ComboUICustomization";

export default function ComboStep({formData,errors,setFormData,currencyFormat,handleProductsPicker}) {
    const currencySymbol = currencyFormat.split('{{')[0].trim();
    const calculatePrices = () => {
        const totalPrice = formData.products.reduce((sum, product) => 
          sum + (parseFloat(product.price) * product.quantity), 0
        );
        let discountedPrice = totalPrice;
    
        if (!formData.discountValue || isNaN(parseFloat(formData.discountValue))) {
          return { total: totalPrice, discounted: totalPrice };
        }
    
        switch (formData.discountType) {
          case 'percentage':
            // Percentage off the total price
            discountedPrice = totalPrice * (1 - (parseFloat(formData.discountValue) / 100));
            break;
    
          case 'fixed':
            // Fixed amount off the total price
            discountedPrice = totalPrice - parseFloat(formData.discountValue);
            break;
    
          case 'fixed-price':
            // Set a fixed price for the entire combo
            discountedPrice = parseFloat(formData.discountValue);
            break;
    
          case 'flat-per-item':
            // Discount amount per item
            const totalItems = formData.products.reduce((sum, product) => sum + product.quantity, 0);
            discountedPrice = totalPrice - (parseFloat(formData.discountValue) * totalItems);
            break;
    
          default:
            discountedPrice = totalPrice;
        }
    
        // Ensure price doesn't go below 0
        discountedPrice = Math.max(0, discountedPrice);
    
        return {
          total: totalPrice,
          discounted: discountedPrice,
          saved: totalPrice - discountedPrice
        };
      };
  return (
    <BlockStack gap="800">
       

       
    <div style={{display:'grid', gridTemplateColumns:'2fr 2fr', gap:'20px'}} className="layoutGrid">
    
        {/* Form Fields */}
        <BlockStack gap="400">

          <ComboBasic
            formData={formData}
            errors={errors}
            setFormData={setFormData}
            handleProductsPicker={handleProductsPicker}
          />
          
          <ComboDiscount
            formData={formData}
            errors={errors}
            setFormData={setFormData}
            currencySymbol={currencySymbol}
           />
         
          <ComboFunctionality
            formData={formData}
            setFormData={setFormData}
          />
         
          <ComboUI
             formData={formData}
             errors={errors}
             setFormData={setFormData}
          />
         
          <ComboUICustomization
             formData={formData}
             setFormData={setFormData}
          />
         
        </BlockStack>
     
      {/* Preview Section */}
     
       <ComboBlock
          formData={formData}
          currencySymbol={currencySymbol}
          calculatePrices={calculatePrices}
       />
     
      </div>
  
  </BlockStack>
  )
}
