export function calculateDiscountedPrice(originalPrice, discountType, discountValue) {
    if (discountType === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else if (discountType === 'fixed') {
      return Math.max(0, originalPrice - discountValue);
    }
    return originalPrice;
  }
  
  export function getMediaContentType(mimeType) {
    const mimeTypeMap = {
      'image/jpeg': 'IMAGE',
      'image/png': 'IMAGE',
      'image/gif': 'IMAGE',
      'image/webp': 'IMAGE',
      'image/svg+xml': 'IMAGE',
      'video/mp4': 'VIDEO',
      'video/webm': 'VIDEO',
      'video/ogg': 'VIDEO',
      'model/gltf-binary': 'MODEL_3D',
      'model/gltf+json': 'MODEL_3D'
    };
  
    return mimeTypeMap[mimeType] || 'IMAGE';
  }
  
  export async function pollJobStatus(admin, jobId, options = {}) {
    const {
      timeout = 20000,
      pollInterval = 1000,
      componentLimit = 50,
      onComplete,
      onFailed
    } = options;
  
    const startTime = Date.now();
  
    while (true) {
      try {
        const response = await admin.graphql(options.jobPollerQuery, {
          variables: {
            componentLimit,
            jobId
          }
        });
  
        const data = await response.json();
        const status = data.data.productOperation.status;
  
        if (status === 'COMPLETE') {
          return onComplete ? onComplete(data.data.productOperation) : data.data.productOperation;
        } else if (status === 'FAILED') {
          const error = new Error('Job failed: ' + JSON.stringify(data.data.productOperation.userErrors));
          if (onFailed) {
            onFailed(error);
          } else {
            throw error;
          }
        }
  
        if (Date.now() - startTime > timeout) {
          throw new Error(`Job timed out after ${timeout / 1000} seconds`);
        }
  
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error("Error polling job status:", error);
        throw error;
      }
    }
  }
  
  export async function handleGraphQLResponse(response, errorMessage) {
    const result = await response.json();
    const data = result.data;
    const operation = Object.keys(data)[0];
    const errors = data[operation].userErrors;
  
    if (errors && errors.length > 0) {
      throw new Error(`${errorMessage}: ${JSON.stringify(errors)}`);
    }
  
    return data;
  }
  
  export function calculateStoreAge(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 30) {
        return `${diffDays} days`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''}`;
    }
  }
  
  export function calculatePriceChange(oldProducts, newProducts) {
    const oldProductMap = new Map(oldProducts.map(p => [p.id, p]));
    const newProductMap = new Map(newProducts.map(p => [p.id, p]));
  
    let priceChange = 0;
  
    oldProducts.forEach(oldProduct => {
      const newProduct = newProductMap.get(oldProduct.id);
      if (!newProduct) {
        priceChange -= getProductPrice(oldProduct) * oldProduct.quantity;
      } else if (oldProduct.quantity !== newProduct.quantity) {
        priceChange += (newProduct.quantity - oldProduct.quantity) * getProductPrice(oldProduct);
      }
    });
  
    newProducts.forEach(newProduct => {
      if (!oldProductMap.has(newProduct.id)) {
        priceChange += getProductPrice(newProduct) * newProduct.quantity;
      }
    });
  
    return priceChange;
  }
  
  function getProductPrice(product) {
    if (product.variants && product.variants.length > 0) {
      return parseFloat(product.variants[0].price);
    } else if (product.price) {
      return parseFloat(product.price);
    } else {
      console.warn(`Unable to determine price for product: ${product.id}`);
      return 0;
    }
  }