import { Card,Text } from "@shopify/polaris"

export default function ComboBlock({formData,currencySymbol,calculatePrices}) {
  return (
    <div style={{position: 'sticky', top: '20px', height:'fit-content'}}>
          <Card>
            <Text variant="headingMd" as="h2">Preview</Text>
            <div style={{
              backgroundColor: formData.containerBackground,
              borderRadius: `${formData.containerBorderRadius}px`,
              padding: `${formData.containerPadding}px`,
              marginTop: '20px'
            }}>
              <div style={{
                backgroundColor: formData.containerBackground,
                borderRadius: `${formData.containerBorderRadius}px`
                }}>
                {/* Title */}
                <div style={{
                    [formData.titleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.titleStyle,
                    fontSize: `${formData.titleSize}px`,
                    color: formData.titleColor,
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    {formData.comboTitle || 'Bundle & Save'}
                </div>

                {/* Products Stack in Preview */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${formData.productSpacing}px`
                }}>
                    {formData.products.map((product, index) => (
                    <div key={product.id}>
                        <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                        }}>
                        {product.image && (
                            <img 
                            src={product.image?.originalSrc || product.image?.url} 
                            alt={product.title}
                            style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover'
                            }}
                            />
                        )}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{
                                [formData.productTitleStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.productTitleStyle,
                                fontSize: `${formData.productTitleSize}px`,
                                color: formData.productTitleColor
                                }}>
                                {product.title}
                                </span>
                                <span style={{
                                [formData.quantityInputStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.quantityLabelStyle,
                                fontSize: `${formData.quantityInputSize}px`,
                                color: formData.quantityInputColor,
                                backgroundColor: formData.quantityLabelColor,
                                borderRadius: `${formData.quantityLabelRadius}px`,
                                padding: `${formData.quantityLabelSize}px`,
                                display: 'block',
                                lineHeight: '120%',
                                width: 'fit-content',
                                }}>
                                x {product.quantity}
                                </span>
                            </div>
                            <span style={{
                            [formData.priceStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.priceStyle,
                            fontSize: `${formData.priceSize}px`,
                            color: formData.priceColor
                            }}>
                            {currencySymbol}{formData?.settings?.showUnitPrice 
                                              ? product?.price
                                              : (product.price * product.quantity).toFixed(2)
                                            }
                            </span>
                        </div>
                        </div>
                        {index < formData.products.length - 1 && (
                        <div style={{
                            textAlign: 'center',
                            margin: '10px 0',
                            fontSize: '20px',
                            color: formData.titleColor
                        }}>
                            +
                        </div>
                        )}
                    </div>
                    ))}
                </div>

                {/* Total Section */}
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                    {formData.highlightedTag && (
                        <div style={{
                        backgroundColor: formData.tagBackground,
                        color: formData.tagColor,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        [formData.tagStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.tagStyle,
                        fontSize: `${formData.tagSize}px`,
                        marginBottom: '8px'
                        }}>
                        {formData.highlightedTag}
                        </div>
                    )}
                    <div style={{
                        [formData.totalPriceStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.totalPriceStyle,
                        fontSize: `${formData.totalPriceSize}px`,
                        color: formData.totalPriceColor
                    }}>
                        {formData.discountValue && formData?.settings?.showComparePrice && (
                        <span style={{
                            textDecoration: 'line-through',
                            [formData.strikePriceStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.strikePriceStyle,
                            color: formData.strikePriceColor,
                            marginRight: '8px',
                            fontSize: `${formData.strikePriceSize}px`
                        }}>
                            {currencySymbol}{calculatePrices().total.toFixed(2)}
                        </span>
                        )}
                        {currencySymbol}{calculatePrices().discounted.toFixed(2)}
                        
                    </div>
                    </div>
                    
                    <button style={{
                    backgroundColor: formData.buttonBackground,
                    color: formData.buttonTextColor,
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: `${formData.buttonBorderRadius}px`,
                    fontSize: `${formData.buttonTextSize}px`,
                    cursor: 'pointer'
                    }}>
                    {formData.callToAction || 'Add to Cart'}
                    </button>
                </div>

                {/* Footer Text */}
                {formData.footerText && (
                    <div style={{
                    marginTop: '15px',
                    textAlign: 'center',
                    color: formData.footerTextColor,
                    [formData.footerTextStyle === 'italic' ? 'fontStyle' : 'fontWeight']: formData.footerTextStyle,
                    fontSize: `${formData.footerTextSize}px`
                    }}>
                    {formData.footerText}
                    </div>
                )}
                </div>
            </div>
          </Card>
        </div>
  )
}
