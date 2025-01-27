
import { Card,BlockStack,Text,Grid,RangeSlider,Select } from "@shopify/polaris";


export default function VolumeDesign({formData,setFormData}) {
  return (
    <Card>
    <BlockStack gap="400">
      <Text variant="headingMd" as="h2">Style Settings</Text>
      
      {/* Block Title Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Block Title Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.blockTitleSize}
                onChange={(value) => setFormData({...formData, blockTitleSize: value})}
                min={12}
                max={32}
                step={1}
                suffix={formData.blockTitleSize + 'px'}
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
                value={formData.blockTitleStyle}
                onChange={(value) => setFormData({...formData, blockTitleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.blockTitleColor}
                  onChange={(e) => setFormData({...formData, blockTitleColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Offer Title Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Offer Title Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.offerTitleSize}
                onChange={(value) => setFormData({...formData, offerTitleSize: value})}
                min={10}
                max={24}
                step={1}
                suffix={formData.offerTitleSize + 'px'}
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
                value={formData.offerTitleStyle}
                onChange={(value) => setFormData({...formData, offerTitleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.offerTitleColor}
                  onChange={(e) => setFormData({...formData, offerTitleColor: e.target.value})}
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
                value={formData.priceTitleSize}
                onChange={(value) => setFormData({...formData, priceTitleSize: value})}
                min={8}
                max={20}
                step={1}
                suffix={formData.priceTitleSize + 'px'}
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
                value={formData.priceTitleStyle}
                onChange={(value) => setFormData({...formData, priceTitleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.priceTitleColor}
                  onChange={(e) => setFormData({...formData, priceTitleColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Compare Price Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Compare Price Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.cpriceTitleSize}
                onChange={(value) => setFormData({...formData, cpriceTitleSize: value})}
                min={6}
                max={16}
                step={1}
                suffix={formData.cpriceTitleSize + 'px'}
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
                value={formData.cpriceTitleStyle}
                onChange={(value) => setFormData({...formData, cpriceTitleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.cpriceTitleColor}
                  onChange={(e) => setFormData({...formData, cpriceTitleColor: e.target.value})}
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
                value={formData.tagTitleSize}
                onChange={(value) => setFormData({...formData, tagTitleSize: value})}
                min={8}
                max={16}
                step={1}
                suffix={formData.tagTitleSize + 'px'}
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
                value={formData.tagTitleStyle}
                onChange={(value) => setFormData({...formData, tagTitleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Text Color</Text>
                <input
                  type="color"
                  value={formData.tagTitleColor}
                  onChange={(e) => setFormData({...formData, tagTitleColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 3}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Background</Text>
                <input
                  type="color"
                  value={formData.tagBackgroundColor}
                  onChange={(e) => setFormData({...formData, tagBackgroundColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Footer Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Footer Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 4}}>
              <RangeSlider
                label="Size"
                value={formData.footerTitleSize}
                onChange={(value) => setFormData({...formData, footerTitleSize: value})}
                min={8}
                max={20}
                step={1}
                suffix={formData.footerTitleSize + 'px'}
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
                value={formData.footerTitleStyle}
                onChange={(value) => setFormData({...formData, footerTitleStyle: value})}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 4}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Color</Text>
                <input
                  type="color"
                  value={formData.footerTitleColor}
                  onChange={(e) => setFormData({...formData, footerTitleColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>

      {/* Option Box Styling */}
      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Option Box Style</Text>
          <Grid>
            <Grid.Cell columnSpan={{xs: 6}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Border Color</Text>
                <input
                  type="color"
                  value={formData.optionBorderColor}
                  onChange={(e) => setFormData({...formData, optionBorderColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Background</Text>
                <input
                  type="color"
                  value={formData.optionBackgroundColor}
                  onChange={(e) => setFormData({...formData, optionBackgroundColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            </Grid>
            <Grid>
            <Grid.Cell columnSpan={{xs: 6}}>
              <div style={{ marginBottom: '10px' }}>
                <Text variant="bodyMd" as="p">Non-Selected Background</Text>
                <input
                  type="color"
                  value={formData.optionNonSelectedBackgroundColor}
                  onChange={(e) => setFormData({...formData, optionNonSelectedBackgroundColor: e.target.value})}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6}}>
              <RangeSlider
                label="Border Width"
                value={formData.borderWidth}
                onChange={(value) => setFormData({...formData, borderWidth: value})}
                min={0}
                max={5}
                step={1}
                suffix={formData.borderWidth + 'px'}
              />
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Card>
    </BlockStack>
  </Card>
  )
}
