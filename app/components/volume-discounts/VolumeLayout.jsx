import { Box,Text,Icon, } from "@shopify/polaris";
import { EditIcon } from "@shopify/polaris-icons";
import { useState,useEffect } from "react";

export default function VolumeLayout({formData,setFormData,styleTemplates}) {
    const themeColors = {
        theme1: {
          border: '#4289ff',
          fill: '#4289ff', 
          background: '#f9faff'
        },
        theme2: {
          border: '#ff6b82',
          fill: '#ff6b82',
          background: '#fff9fa'
        },
        theme3: {
          border: '#237f00',
          fill: '#237f00',
          background: '#f4fbf9'
        }
      };
      const themeColorMappings = {
                  theme1: {
                    blockTitleColor: '#4289ff',
                    offerTitleColor: '#4289ff',
                    discountLabelColor: '#1c221e',
                    priceTitleColor: '#4289ff',
                    cpriceTitleColor: '#808080',
                    tagTitleColor: '#FFFFFF',
                    tagBackgroundColor: '#4289ff',
                    footerTitleColor: '#4289ff',
                    optionBorderColor: '#4289ff',
                    optionBackgroundColor: '#f9faff',
                    optionNonSelectedBackgroundColor: '#ffffff'
                  },
                  theme2: {
                    blockTitleColor: '#ff6b82',
                    offerTitleColor: '#ff6b82',
                    discountLabelColor: '#1c221e',
                    priceTitleColor: '#ff6b82',
                    cpriceTitleColor: '#808080',
                    tagTitleColor: '#FFFFFF',
                    tagBackgroundColor: '#ff6b82',
                    footerTitleColor: '#ff6b82',
                    optionBorderColor: '#ff6b82',
                    optionBackgroundColor: '#fff9fa',
                    optionNonSelectedBackgroundColor: '#ffffff'
                  },
                  theme3: {
                    blockTitleColor: '#237f00',
                    offerTitleColor: '#237f00',
                    discountLabelColor: '#1c221e',
                    priceTitleColor: '#237f00',
                    cpriceTitleColor: '#808080',
                    tagTitleColor: '#FFFFFF',
                    tagBackgroundColor: '#237f00',
                    footerTitleColor: '#237f00',
                    optionBorderColor: '#237f00',
                    optionBackgroundColor: '#f4fbf9',
                    optionNonSelectedBackgroundColor: '#ffffff'
                  }
                };
      const [selectedTheme, setSelectedTheme] = useState('theme1');
                const handleThemeChange = (theme) => {
                  setSelectedTheme(theme);
                  if (formData.layout === 'vertical') {
                    setFormData(prev => ({
                      ...prev,
                      blockTitleColor: themeColorMappings[theme].blockTitleColor,
                      offerTitleColor: themeColorMappings[theme].offerTitleColor,
                      discountLabelColor: themeColorMappings[theme].discountLabelColor,
                      priceTitleColor: themeColorMappings[theme].priceTitleColor,
                      cpriceTitleColor: themeColorMappings[theme].cpriceTitleColor,
                      tagTitleColor: themeColorMappings[theme].tagTitleColor,
                      tagBackgroundColor: themeColorMappings[theme].tagBackgroundColor,
                      footerTitleColor: themeColorMappings[theme].footerTitleColor,
                      optionBorderColor: themeColorMappings[theme].optionBorderColor,
                      optionBackgroundColor: themeColorMappings[theme].optionBackgroundColor,
                      optionNonSelectedBackgroundColor: themeColorMappings[theme].optionNonSelectedBackgroundColor
                    }));
                  }
                };
                const handleLayoutChange = (newLayout) => {
                    setFormData(prev => ({
                      ...prev,
                      layout: newLayout
                    }));
                    if(newLayout === 'horizontal'){
                      setFormData(prev =>({
                        ...prev,
                        blockTitleColor: styleTemplates[formData.discountType].blockTitleColor,
                        offerTitleColor: styleTemplates[formData.discountType].offerTitleColor,
                        discountLabelColor: styleTemplates[formData.discountType].discountLabelColor,
                        priceTitleColor: styleTemplates[formData.discountType].priceTitleColor,
                        cpriceTitleColor: styleTemplates[formData.discountType].cpriceTitleColor,
                        tagTitleColor: styleTemplates[formData.discountType].tagTitleColor,
                        tagBackgroundColor: styleTemplates[formData.discountType].tagBackgroundColor,
                        footerTitleColor: styleTemplates[formData.discountType].footerTitleColor,
                        optionBorderColor: styleTemplates[formData.discountType].optionBorderColor,
                        optionBackgroundColor: styleTemplates[formData.discountType].optionBackgroundColor,
                        optionNonSelectedBackgroundColor: styleTemplates[formData.discountType].optionNonSelectedBackgroundColor
                      }))
                    }
                  };
                   useEffect(() => {
                                    if (formData.layout === 'horizontal') {
                                      setSelectedTheme('horizontal1');
                                    } else {
                                      setSelectedTheme('theme1');
                                    }
                                  }, [formData.layout]);
  return (
    <Box
                           padding="400"
                           background="bg-surface"
                           borderRadius="200"
                           shadow="200"
                           borderColor="#dedede"
                           borderStyle="solid"
                         >
                           <div
                             style={{
                               display: "flex",
                               alignItems: "center",
                               gap: "50px",
                             }}
                           >
                             <>
                               
                               <div
                                 
                                 style={{ display: "flex", flexDirection: "column", gap: "5px" }}
                               >
                                 <div
                                   style={{
                                     display: "flex",
                                     alignItems: "center",
                                     gap: "5px",
                                     width: "fit-content"
                                   }}
                                 >
                                   <Text variant="bodySm" as="p" fontWeight="medium">
                                     Template Layout
                                   </Text>
                                   <Icon source={EditIcon}></Icon>
                                 </div>
       
                                 <div style={{ display: 'flex', gap: '16px' }}>
                                   <div
                                     role="button"
                                     onClick={() => handleLayoutChange('vertical')}
                                     style={{
                                       padding: '5px',
                                       border: `2px solid ${formData.layout === 'vertical' ? '#000000' : '#e1e3e5'}`,
                                       borderRadius: '8px',
                                       cursor: 'pointer',
                                       backgroundColor: '#ffffff',
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: '8px'
                                     }}
                                   >
                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                       <rect x="4" y="4" width="16" height="4" fill={formData.layout === 'vertical' ? '#000000' : '#8c9196'} />
                                       <rect x="4" y="10" width="16" height="4" fill={formData.layout === 'vertical' ? '#000000' : '#8c9196'} />
                                       <rect x="4" y="16" width="16" height="4" fill={formData.layout === 'vertical' ? '#000000' : '#8c9196'} />
                                     </svg>
                                     <Text variant="bodySm" as="p" fontWeight={formData.layout === 'vertical' ? 'bold' : 'regular'}>
                                       Vertical
                                     </Text>
                                   </div>
       
                                   <div
                                     role="button"
                                     onClick={() => handleLayoutChange('horizontal')}
                                     style={{
                                       padding: '5px',
                                       border: `2px solid ${formData.layout === 'horizontal' ? '#000000' : '#e1e3e5'}`,
                                       borderRadius: '8px',
                                       cursor: 'pointer',
                                       backgroundColor: '#ffffff',
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: '8px'
                                     }}
                                   >
                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                       <rect x="2" y="6" width="6" height="12" fill={formData.layout === 'horizontal' ? '#000000' : '#8c9196'} />
                                       <rect x="9" y="6" width="6" height="12" fill={formData.layout === 'horizontal' ? '#000000' : '#8c9196'} />
                                       <rect x="16" y="6" width="6" height="12" fill={formData.layout === 'horizontal' ? '#000000' : '#8c9196'} />
                                     </svg>
                                     <Text variant="bodySm" as="p" fontWeight={formData.layout === 'horizontal' ? 'bold' : 'regular'}>
                                       Horizontal
                                     </Text>
                                   </div>
                                 </div>
                               </div>
                               <div
                                
                                 style={{ display: "flex", flexDirection: "column", gap: "5px" }}
                               >
                                 <div
                                   style={{
                                     display: "flex",
                                     alignItems: "center",
                                     gap: "5px",
                                     width: "fit-content"
                                   }}
                                 >
                                   <Text variant="bodySm" as="p" fontWeight="medium">
                                     Choose a Theme
                                   </Text>
                                   <Icon source={EditIcon}></Icon>
                                 </div>
       
                                 <div style={{ display: 'flex', gap: '16px' }}>
                               {formData.layout === 'vertical' ? (
                                    // Vertical themes
                                       <>
                                       <div
                                         role="button"
                                         onClick={() => handleThemeChange('theme1')}
                                         style={{
                                           padding: '5px',
                                           border: `2px solid ${selectedTheme === 'theme1' ? themeColors.theme1.border : '#e1e3e5'}`,
                                           borderRadius: '8px',
                                           cursor: 'pointer',
                                           backgroundColor: selectedTheme === 'theme1' ? themeColors.theme1.background : '#ffffff',
                                           display: 'flex',
                                           alignItems: 'center',
                                           gap: '8px'
                                         }}
                                       >
                                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                           <rect width="24" height="8" fill={selectedTheme === 'theme1' ? themeColors.theme1.fill : '#8c9196'} />
                                           <rect y="10" width="24" height="8" fill={selectedTheme === 'theme1' ? themeColors.theme1.fill : '#8c9196'} />
                                           <rect y="20" width="24" height="4" fill={selectedTheme === 'theme1' ? themeColors.theme1.fill : '#8c9196'} />
                                         </svg>
                                       </div>
       
                                       <div
                                         role="button"
                                         onClick={() => handleThemeChange('theme2')}
                                         style={{
                                           padding: '5px',
                                           border: `2px solid ${selectedTheme === 'theme2' ? themeColors.theme2.border : '#e1e3e5'}`,
                                           borderRadius: '8px',
                                           cursor: 'pointer',
                                           backgroundColor: selectedTheme === 'theme2' ? themeColors.theme2.background : '#ffffff',
                                           display: 'flex',
                                           alignItems: 'center',
                                           gap: '8px'
                                          
                                         }}
                                       >
                                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                           <rect width="24" height="6" fill={selectedTheme === 'theme2' ? themeColors.theme2.fill : '#8c9196'} />
                                           <rect y="8" width="24" height="6" fill={selectedTheme === 'theme2' ? themeColors.theme2.fill : '#8c9196'} />
                                           <rect y="16" width="24" height="6" fill={selectedTheme === 'theme2' ? themeColors.theme2.fill : '#8c9196'} />
                                         </svg>
                                         
                                       </div>
       
                                       <div
                                         role="button"
                                         onClick={() => handleThemeChange('theme3')}
                                         style={{
                                           padding: '5px',
                                           border: `2px solid ${selectedTheme === 'theme3' ? themeColors.theme3.border : '#e1e3e5'}`,
                                           borderRadius: '8px',
                                           cursor: 'pointer',
                                           backgroundColor: selectedTheme === 'theme3' ? themeColors.theme3.background : '#ffffff',
                                           display: 'flex',
                                           alignItems: 'center',
                                           gap: '8px'
                                         }}
                                       >
                                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                           <rect width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                           <rect y="6" width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                           <rect y="12" width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                           <rect y="18" width="24" height="4" fill={selectedTheme === 'theme3' ? themeColors.theme3.fill : '#8c9196'} />
                                         </svg>
                                       </div>
                                       </>
                                  ) : (
                                     // Horizontal theme
                                       <div
                                         role="button"
                                         onClick={() => handleThemeChange('horizontal1')}
                                         style={{
                                           padding: '5px',
                                           border: `2px solid ${selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#e1e3e5'}`,
                                           borderRadius: '8px',
                                           cursor: 'pointer',
                                           backgroundColor: selectedTheme === 'horizontal1' ? formData.optionBackgroundColor : '#ffffff',
                                           display: 'flex',
                                           alignItems: 'center',
                                           gap: '8px'
                                         }}
                                       >
                                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                           <rect x="0" y="8" width="8" height="8" fill={selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#8c9196'} />
                                           <rect x="10" y="8" width="8" height="8" fill={selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#8c9196'} />
                                           <rect x="20" y="8" width="8" height="8" fill={selectedTheme === 'horizontal1' ? formData.optionBorderColor : '#8c9196'} />
                                         </svg>
                                       </div>
                                     )}
                                 </div>
                               </div>
                              
                             </>
                           </div>
                         </Box>
  )
}
