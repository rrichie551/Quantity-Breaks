import { Card,Text } from "@shopify/polaris"

export default function VolumeBlock({
    formData,
    currencySymbol
}) {

        const calculateDiscountedPrice = (offer, originalPrice) => {
            let basePrice = originalPrice;
            if (!formData?.settings?.showUnitPrice){
               basePrice = offer.quantity * originalPrice;
          }
            
            switch (offer.discountType) {
              case 'percentage':
               
                return basePrice - (basePrice * (parseFloat(offer.discountValue) / 100));
                
              case 'flat':
                
                return basePrice - parseFloat(offer.discountValue);
                
              case 'flat-per-item':
               
                return basePrice - (parseFloat(offer.discountValue) * offer.quantity);
                
              case 'fixed':
                
                return parseFloat(offer.discountValue);
                
              default:
                return basePrice;
            }
          };
          const calculateDiscountedPrice2 = (offer, originalPrice) => {
            const basePrice = offer.quantity * originalPrice;
        
            switch (offer.discountType) {
              case 'percentage':
               
                return basePrice - (basePrice * (parseFloat(offer.discountValue) / 100));
                
              case 'flat':
                
                return basePrice - parseFloat(offer.discountValue);
                
              case 'flat-per-item':
               
                return basePrice - (parseFloat(offer.discountValue) * offer.quantity);
                
              case 'fixed':
                
                return parseFloat(offer.discountValue);
                
              default:
                return basePrice;
            }
          };
  return (
    <div style={{position:'sticky', top:'10px', height: 'fit-content', width:"410px", maxWidth:"410px"}} className="sticky-card">
          
           
            <Card>
            <Text>Block Preview</Text>
              <div style={{
                backgroundColor: 'transparent',
                paddingTop: '20px' 
              }}>
              
               
                  <span style={{
                    color: formData.blockTitleColor,
                    [formData.blockTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.blockTitleStyle,
                    textAlign: 'center',
                    display: 'block',
                    marginBottom: '20px',
                    fontSize: `${formData.blockTitleSize}px`
                  }}>
                    {formData.blockTitle}
                  </span>
                
                <div style={{
                display: "flex",
                flexDirection: formData.layout === 'vertical' ? 'column' : 'row',
                gap: "15px",
              }}>
                  {formData.offers.map((offer, index) => (
                    <>
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'start',
                        padding: '15px',
                        border: `${formData.borderWidth}px solid ${offer.active  ?  formData.optionBorderColor : '#ddd'}`,
                        borderRadius: `${formData.borderRadius}px`,
                        position: 'relative',
                        width:  formData.layout === 'vertical' ? '100%': '33.33%',
                        backgroundColor: offer.active ? formData.optionBackgroundColor : formData.optionNonSelectedBackgroundColor
                      }}
                    >
                      <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: formData.layout === 'vertical' ? 'row':'column',
                        gap: '10px',
                        width:"100%"
                      }}
                      >
                      {/* Custom Radio */}
                      <div style={{
                        width: '17px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${offer.active ? formData.optionBorderColor : 'grey'}`,
                        marginRight: '15px',
                        display: 'flex',
                        margin: formData.layout === 'vertical' ? '0' : '0 auto',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: offer.active ? formData.optionBorderColor : 'transparent',
                        }} />
                      </div>
    
                      {/* Offer Content */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexDirection: formData.layout === 'vertical' ? 'row':'column', gap: formData.layout === 'vertical' ? '0px': '10px' }}>
                        
                        <span style={{ display: 'flex', flexDirection: 'column', gap:formData.layout === 'vertical' ? '0px': '5px', alignItems:formData.layout === 'vertical' ? 'start': 'center', fontSize: `${formData.offerTitleSize}px`, color: formData.offerTitleColor, [formData.offerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.offerTitleStyle }}>
                          {offer.offerTitle}<br/>
                          <span style={{ fontSize: `${formData.priceTitleSize}px`, color: formData.priceTitleColor, [formData.priceTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.priceTitleStyle, lineHeight: '120%' }}>{currencySymbol}{calculateDiscountedPrice(offer,formData?.selections[0]?.price) > 0 ? calculateDiscountedPrice(offer,formData?.selections[0]?.price).toFixed(2) : formData?.selections[0]?.price}
                            <span style={{ fontSize: "8px" }}>{formData?.settings?.showUnitPrice && formData?.settings?.unitPriceLabel}</span>
                          </span>
                          {offer.discountValue && offer.discountValue > 0 && (
                            <span 
                              style={{ 
                                fontSize: `${formData.cpriceTitleSize}px`, 
                                color: formData.cpriceTitleColor, 
                                [formData.cpriceTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.cpriceTitleStyle, 
                                lineHeight: '120%', 
                                textDecoration: 'line-through'
                              }}
                            >
                             {formData?.settings?.showComparePrice && (
                                currencySymbol + 
                                (offer.quantity * formData?.selections[0]?.price > 0 
                                  ? (offer.quantity * formData?.selections[0]?.price).toFixed(2) 
                                  : formData?.selections[0]?.price
                                )
                              )}
                            </span>
                          )}
                        </span>
            
                        <div style={{display:'flex', flexDirection:'column', alignItems: 'center'}}>
                        {offer.tag && (
                        <div style={{
                          backgroundColor: formData.tagBackgroundColor,
                          color: formData.tagTitleColor,
                          padding: '2px 4px',
                          lineHeight: '10px',
                          borderRadius: '4px',
                          fontSize: `${formData.tagTitleSize}px`,
                          [formData.tagTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.tagTitleStyle
                        }}>
                          {offer.tag}
                        </div>
                      )}
                        {/* Prices */}
                        <div>
                          <span style={{ fontSize: `${formData.discountLabelSize}px`, color: formData.discountLabelColor, [formData.discountLabelStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.discountLabelStyle }} >
                             {offer.discountLabel}
                          </span>
                        </div>
                        </div>
                      </div>
    
                      </div>
    
                     {/* Offer Variants */}
                     <div style={{width: "100%"}}>
                     {formData?.settings?.allowVariants && 
                          formData?.applyTo === 'PRODUCTS' && 
                          formData?.selections[0]?.options?.length > 0 && 
                          offer?.quantity && 
                          parseInt(offer.quantity) > 0 && formData?.layout === 'vertical' && (
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              counterReset: 'item'
                            }}>
                            {[...Array(parseInt(offer?.quantity))].map((_, quantityIndex) => (
                              <div 
                                key={`quantity-${quantityIndex}`} 
                                style={{
                                  display: 'flex',
                                  gap: '8px',
                                  padding: '4px 0',
                                  position: 'relative',
                                  paddingLeft: '25px',
                                  counterIncrement: 'item'
                                }}
                                className="variant-item"
                              >
                                <style>
                                  {`
                                    .variant-item::before {
                                      content: counter(item);
                                      position: absolute;
                                      top:7px;
                                      left: 8px;
                                      color: #637381;
                                      font-size: 9px;
                                    }
                                  `}
                                </style>
                                {formData?.selections[0]?.options?.map((option, optionIndex) => (
                                  <select
                                    key={`${quantityIndex}-${optionIndex}`}
                                    label={option.name}
                                    onChange={() => {}}
                                    value={option.values[0]}
                                    style={{
                                      padding: '3px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      border: '1px solid #d9d9d9',
                                      backgroundColor: '#fff',
                                      color: '#000',
                                      width: '100%',
                                      flex: 1
                                    }}
                                  >
                                    {option.values.map((value, valueIndex) => (
                                      <option key={valueIndex} value={value}>
                                        {value}
                                      </option>
                                    ))}
                                  </select>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div> 
                    </div>
                     
                    </>
                  ))}
                </div>
                {(formData.footerText1 || formData.footerText2) && (
                  <div style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: formData?.settings?.showTotalPrice?  "space-between": "center"
                  }}>
                    {formData.footerText1 && (
                          <span 
                            style={{
                              fontSize: `${formData.footerTitleSize}px`, 
                              color: formData.footerTitleColor, 
                              [formData.footerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTitleStyle
                            }}
                          >
                            {formData.footerText1}
                          </span>
                        )}
                    {formData.footerText2 && formData?.settings?.showTotalPrice && (
                       <span style={{fontSize: `${formData.footerTitleSize}px`, color: formData.footerTitleColor, [formData.footerTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTitleStyle}}>
                        {formData.footerText2} {currencySymbol}{calculateDiscountedPrice2(formData.offers.find(offer => offer.active === true),formData?.selections[0]?.price) > 0 ? calculateDiscountedPrice2(formData.offers.find(offer => offer.active === true),formData?.selections[0]?.price).toFixed(2) : formData?.selections[0]?.price}
                        
                        </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
  )
}
