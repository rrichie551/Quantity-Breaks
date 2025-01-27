import { Card,BlockStack,Text,Grid,RangeSlider,Select } from "@shopify/polaris"

export default function ComboUICustomization({formData,setFormData}) {
  return (
   
    <Card>
    <BlockStack gap="400">
      <Text variant="headingMd" as="h2">UI Customization</Text>
      
      {/* Title Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Title Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.titleSize}
                onChange={(value) => setFormData({...formData, titleSize: value})}
                min={12}
                max={32}
                step={1}
                suffix={formData.titleSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <Select
                label="Style"
                options={[
                  {label: 'Normal', value: 'normal'},
                  {label: 'Bold', value: 'bold'},
                  {label: 'Italic', value: 'italic'}
                ]}
                value={formData.titleStyle}
                onChange={(value) => setFormData({...formData, titleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.titleColor}
                  onChange={(e) => setFormData({...formData, titleColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Product Title Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Product Title Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.productTitleSize}
                onChange={(value) => setFormData({...formData, productTitleSize: value})}
                min={12}
                max={24}
                step={1}
                suffix={formData.productTitleSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <Select
                label="Style"
                options={[
                  {label: 'Normal', value: 'normal'},
                  {label: 'Bold', value: 'bold'},
                  {label: 'Italic', value: 'italic'}
                ]}
                value={formData.productTitleStyle}
                onChange={(value) => setFormData({...formData, productTitleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.productTitleColor}
                  onChange={(e) => setFormData({...formData, productTitleColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Price Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Price Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.priceSize}
                onChange={(value) => setFormData({...formData, priceSize: value})}
                min={12}
                max={24}
                step={1}
                suffix={formData.priceSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <Select
                label="Style"
                options={[
                  {label: 'Normal', value: 'normal'},
                  {label: 'Bold', value: 'bold'},
                  {label: 'Italic', value: 'italic'}
                ]}
                value={formData.priceStyle}
                onChange={(value) => setFormData({...formData, priceStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.priceColor}
                  onChange={(e) => setFormData({...formData, priceColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Total Price Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Total Price Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.totalPriceSize}
                onChange={(value) => setFormData({...formData, totalPriceSize: value})}
                min={14}
                max={32}
                step={1}
                suffix={formData.totalPriceSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <Select
                label="Style"
                options={[
                  {label: 'Normal', value: 'normal'},
                  {label: 'Bold', value: 'bold'},
                  {label: 'Italic', value: 'italic'}
                ]}
                value={formData.totalPriceStyle}
                onChange={(value) => setFormData({...formData, totalPriceStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.totalPriceColor}
                  onChange={(e) => setFormData({...formData, totalPriceColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Tag Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Tag Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 3}}>
              <RangeSlider
                label="Size"
                value={formData.tagSize}
                onChange={(value) => setFormData({...formData, tagSize: value})}
                min={10}
                max={20}
                step={1}
                suffix={formData.tagSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <Select
                label="Style"
                options={[
                  {label: 'Normal', value: 'normal'},
                  {label: 'Bold', value: 'bold'},
                  {label: 'Italic', value: 'italic'}
                ]}
                value={formData.tagStyle}
                onChange={(value) => setFormData({...formData, tagStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Text Color</Text>
                <input
                  type="color"
                  value={formData.tagColor}
                  onChange={(e) => setFormData({...formData, tagColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Background</Text>
                <input
                  type="color"
                  value={formData.tagBackground}
                  onChange={(e) => setFormData({...formData, tagBackground: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Button Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Button Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 3}}>
              <RangeSlider
                label="Text Size"
                value={formData.buttonTextSize}
                onChange={(value) => setFormData({...formData, buttonTextSize: value})}
                min={12}
                max={24}
                step={1}
                suffix={formData.buttonTextSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Text Color</Text>
                <input
                  type="color"
                  value={formData.buttonTextColor}
                  onChange={(e) => setFormData({...formData, buttonTextColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Background</Text>
                <input
                  type="color"
                  value={formData.buttonBackground}
                  onChange={(e) => setFormData({...formData, buttonBackground: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <RangeSlider
                label="Border Radius"
                value={formData.buttonBorderRadius}
                onChange={(value) => setFormData({...formData, buttonBorderRadius: value})}
                min={0}
                max={20}
                step={1}
                suffix={formData.buttonBorderRadius + 'px'}
              />
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Container Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Container Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 6}}>
              <RangeSlider
                label="Product Spacing"
                value={formData.productSpacing}
                onChange={(value) => setFormData({...formData, productSpacing: value})}
                min={10}
                max={40}
                step={1}
                suffix={formData.productSpacing + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6}}>
                <RangeSlider
                label="Container Padding"
                value={formData.containerPadding}
                onChange={(value) => setFormData({...formData, containerPadding: value})}
                min={10}
                max={40}
                step={1}
                suffix={formData.containerPadding + 'px'}
                />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Background</Text>
                <input
                  type="color"
                  value={formData.containerBackground}
                  onChange={(e) => setFormData({...formData, containerBackground: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6}}>
              <RangeSlider
                label="Border Radius"
                value={formData.containerBorderRadius}
                onChange={(value) => setFormData({...formData, containerBorderRadius: value})}
                min={0}
                max={20}
                step={1}
                suffix={formData.containerBorderRadius + 'px'}
              />
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Strike Price Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Strike Price Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.strikePriceSize}
                onChange={(value) => setFormData({...formData, strikePriceSize: value})}
                min={10}
                max={24}
                step={1}
                suffix={formData.strikePriceSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <Select
                label="Style"
                options={[
                  {label: 'Normal', value: 'normal'},
                  {label: 'Bold', value: 'bold'},
                  {label: 'Italic', value: 'italic'}
                ]}
                value={formData.strikePriceStyle}
                onChange={(value) => setFormData({...formData, strikePriceStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.strikePriceColor}
                  onChange={(e) => setFormData({...formData, strikePriceColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Footer Text Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Footer Text Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.footerTextSize}
                onChange={(value) => setFormData({...formData, footerTextSize: value})}
                min={10}
                max={20}
                step={1}
                suffix={formData.footerTextSize + 'px'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <Select
                label="Style"
                options={[
                  {label: 'Normal', value: 'normal'},
                  {label: 'Bold', value: 'bold'},
                  {label: 'Italic', value: 'italic'}
                ]}
                value={formData.footerTextStyle}
                onChange={(value) => setFormData({...formData, footerTextStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.footerTextColor}
                  onChange={(e) => setFormData({...formData, footerTextColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Quantity Input Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Quantity Input Style</Text>
          
           
              <Text variant="bodyMd" as="h4">Input Field</Text>
              <Grid>
                
                <Grid.Cell columnSpan={{xs: 4}}>
                  <RangeSlider
                    label="Size"
                    value={formData.quantityInputSize}
                    onChange={(value) => setFormData({...formData, quantityInputSize: value})}
                    min={1}
                    max={20}
                    step={1}
                    suffix={formData.quantityInputSize + 'px'}
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 4}}>
                  <Select
                    label="Style"
                    options={[
                      {label: 'Normal', value: 'normal'},
                      {label: 'Bold', value: 'bold'},
                      {label: 'Italic', value: 'italic'}
                    ]}
                    value={formData.quantityInputStyle}
                    onChange={(value) => setFormData({...formData, quantityInputStyle: value})}
                  />
                </Grid.Cell>
                
                <Grid.Cell columnSpan={{xs: 4}}>
                  <div style={{ marginBottom: '10px' }}>
                    <Text variant="bodyMd" as="p">Color</Text>
                    <input
                      type="color"
                      value={formData.quantityInputColor}
                      onChange={(e) => setFormData({...formData, quantityInputColor: e.target.value})}
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>
                </Grid.Cell>
              </Grid>
              <Text variant="bodyMd" as="h4">Label</Text>
              <Grid>
                <Grid.Cell columnSpan={{xs: 4}}>
                  <RangeSlider
                    label="Size"
                    value={formData.quantityLabelSize}
                    onChange={(value) => setFormData({...formData, quantityLabelSize: value})}
                    min={1}
                    max={16}
                    step={1}
                    suffix={formData.quantityLabelSize + 'px'}
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 4}}>
                <RangeSlider
                    label="Quantity Radius"
                    value={formData.quantityLabelRadius}
                    onChange={(value) => setFormData({...formData, quantityLabelRadius: value})}
                    min={1}
                    max={16}
                    step={1}
                    suffix={formData.quantityLabelRadius + 'px'}
                  />
                </Grid.Cell>
                
                <Grid.Cell columnSpan={{xs: 4}}>
                  <div style={{ marginBottom: '10px' }}>
                    <Text variant="bodyMd" as="p">Color</Text>
                    <input
                      type="color"
                      value={formData.quantityLabelColor}
                      onChange={(e) => setFormData({...formData, quantityLabelColor: e.target.value})}
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>
                </Grid.Cell>
              </Grid>
            
         
        </BlockStack>
      </Card>
    </BlockStack>
  </Card>
  )
}
