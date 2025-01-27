import { Card,BlockStack,Text,Button,Grid,TextField,Select,RadioButton } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
export default function VolumeConfig({formData,setFormData,errors,currencySymbol}) {
     const handleActiveOfferChange = (selectedIndex) => {
              setFormData(prev => ({
                ...prev,
                offers: prev.offers.map((offer, index) => ({
                  ...offer,
                  active: index === selectedIndex
                }))
              }));
            };
            const handleDeleteOffer = (indexToDelete) => {
    
                setFormData(prev => ({
                  ...prev,
                  offers: prev.offers.filter((_, index) => index !== indexToDelete)
                }));
              };
  return (
    <Card>
                   <BlockStack gap="400">
                     <Text variant="headingMd" as="h2">Offers</Text>
                     
                     {formData.offers.map((offer, index) => (
                       <Card key={index}>
                         <div style={{ position: 'relative' }}>
                           {formData.offers.length > 1 && (
                             <div style={{ 
                               position: 'absolute', 
                               top: '-11px', 
                               right: '-10px', 
                               zIndex: 1 
                             }}>
                               <Button
                                 icon={XIcon}
                                 size="micro"
                                 tone="critical"
                                 onClick={() => handleDeleteOffer(index)}
                                 accessibilityLabel="Delete offer"
                               />
                             </div>
                           )}
                           
                           <BlockStack gap="400">
                             {/* Discount Settings */}
                             <Grid>
                               <Grid.Cell columnSpan={{xs: 6}}>
                                 <Select
                                   label="Type of Discount"
                                   options={[
                                     {label: `Percentage Discount (e.g. 10% off)`, value: 'percentage'},
                                     {label: `Flat Discount (e.g. ${currencySymbol}10 off)`, value: 'flat'},
                                     {label: `Flat Discount Per Item (e.g. ${currencySymbol}10 off on each item)`, value: 'flat-per-item'},
                                     {label: `Fixed Price (e.g. ${currencySymbol}10 )`, value: 'fixed'}
                                   ]}
                                   value={offer.discountType}
                                   error={errors.offers?.[index]?.discountType}
                                   onChange={(value) => {
                                     const newOffers = [...formData.offers];
                                     newOffers[index].discountType = value;
                                     setFormData({...formData, offers: newOffers});
                                   }}
                                 />
                                
                               </Grid.Cell>
                               <Grid.Cell columnSpan={{xs: 6}}>
                                 <TextField
                                   label="Discount Value"
                                   type="number"
                                   value={offer.discountValue}
                                   error={errors.offers?.[index]?.discountValue}
                                   onChange={(value) => {
                                     const newOffers = [...formData.offers];
                                     newOffers[index].discountValue = value;
                                     setFormData({...formData, offers: newOffers});
                                   }}
                                 />
                               </Grid.Cell>
                             </Grid>
       
                             {/* Offer Details */}
                             <Grid>
                               <Grid.Cell columnSpan={{xs: 6}}>
                                 <TextField
                                   label="Quantity"
                                   min={1}
                                   type="number"
                                   value={offer.quantity}
                                   error={errors.offers?.[index]?.quantity}
                                   onChange={(value) => {
                                     const newOffers = [...formData.offers];
                                     newOffers[index].quantity = value;
                                     setFormData({...formData, offers: newOffers});
                                   }}
                                 />
                               </Grid.Cell>
                               <Grid.Cell columnSpan={{xs: 6}}>
                                 <TextField
                                   label="Offer Title"
                                   value={offer.offerTitle}
                                   error={errors.offers?.[index]?.offerTitle}
                                   onChange={(value) => {
                                     const newOffers = [...formData.offers];
                                     newOffers[index].offerTitle = value;
                                     setFormData({...formData, offers: newOffers});
                                   }}
                                 />
                               </Grid.Cell>
                             </Grid>
       
                             <Grid>
                               <Grid.Cell columnSpan={{xs: 6}}>
                                 <TextField
                                   label="Discount Label"
                                   value={offer.discountLabel}
                                   onChange={(value) => {
                                     const newOffers = [...formData.offers];
                                     newOffers[index].discountLabel = value;
                                     setFormData({...formData, offers: newOffers});
                                   }}
                                 />
                               </Grid.Cell>
                               <Grid.Cell columnSpan={{xs: 6}}>
                                 <TextField
                                   label="Tag"
                                   value={offer.tag}
                                   onChange={(value) => {
                                     const newOffers = [...formData.offers];
                                     newOffers[index].tag = value;
                                     setFormData({...formData, offers: newOffers});
                                   }}
                                 />
                               </Grid.Cell>
                             </Grid>
                             <RadioButton
                                 label="Set as Default Offer"
                                 checked={offer.active}
                                 onChange={() => handleActiveOfferChange(index)}
                               />
                           </BlockStack>
                         </div>
                       </Card>
                     ))}
       
                     <Button
                       onClick={() => {
                         if (formData.offers.length < 6) {
                           setFormData({
                             ...formData,
                             offers: [...formData.offers, {
                               discountType: 'percentage',
                               discountValue: '',
                               quantity: '',
                               offerTitle: '',
                               discountLabel: '',
                               tag: ''
                             }]
                           });
                         }
                       }}
                       disabled={formData.offers.length >= 6}
                       variant="primary"
                     >
                       Add Offer
                     </Button>
                   </BlockStack>
                 </Card>
  )
}
