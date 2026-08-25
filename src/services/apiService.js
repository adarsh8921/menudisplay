const PRIMARY_API_URL = 'https://kiosk.datacubeglobal.com/api/web-products/GRD5001';
const FALLBACK_API_URL = 'https://kiosk.datacubeglobal.com/api/products/KSK1122';
const API_PRODUCT_IMAGE_BASE = 'https://kiosk.datacubeglobal.com/storage/productImage/';

export async function fetchKioskProducts() {
  try {
    let response = await fetch(PRIMARY_API_URL);
    let isWebProductsApi = true;

    if (!response.ok) {
      response = await fetch(FALLBACK_API_URL);
      isWebProductsApi = false;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const categoriesWithProducts = [];

    if (data.products && Array.isArray(data.products)) {
      const categoryMap = new Map();

      data.products.forEach((p) => {
        const transformedProduct = transformApiProduct(p);
        
        let catName = 'FOOD';
        if (p.category === 8 || transformedProduct.name.toLowerCase().includes('toy') || transformedProduct.name.toLowerCase().includes('baloon')) {
          catName = 'TOYS';
        } else if (p.category === 9 || p.category === 10 || p.category === 11) {
          catName = 'GENERAL SELECTION';
        }

        if (!categoryMap.has(catName)) {
          categoryMap.set(catName, []);
        }
        categoryMap.get(catName).push(transformedProduct);
      });

      let catIdCounter = 1;
      categoryMap.forEach((productsList, catName) => {
        categoriesWithProducts.push({
          id: catIdCounter++,
          name: catName,
          products: productsList,
        });
      });
    } else if (Array.isArray(data.categories)) {
      data.categories.forEach((cat) => {
        const catProducts = [];

        if (Array.isArray(cat.subcategories)) {
          cat.subcategories.forEach((subCat) => {
            if (Array.isArray(subCat.products)) {
              subCat.products.forEach((p) => {
                catProducts.push(transformApiProduct(p, cat.name, subCat.name));
              });
            }
          });
        }

        if (catProducts.length > 0) {
          categoriesWithProducts.push({
            id: cat.id,
            name: cat.name,
            products: catProducts,
          });
        }
      });
    }

    return {
      success: true,
      categories: categoriesWithProducts,
      apiEndpoint: isWebProductsApi ? 'GRD5001' : 'KSK1122',
    };
  } catch (error) {
    console.error('Error fetching Products API:', error);
    return {
      success: false,
      error: error.message,
      categories: [],
    };
  }
}

function transformApiProduct(p, catName = 'CATEGORY', subCatName = '') {
  let imgFileName = null;

  // Extract image filename from product_image array ONLY if present in API
  if (Array.isArray(p.product_image) && p.product_image.length > 0) {
    const firstImgObj = p.product_image[0];
    if (typeof firstImgObj === 'object' && firstImgObj !== null) {
      imgFileName = firstImgObj.image || firstImgObj.url || firstImgObj.path;
    } else if (typeof firstImgObj === 'string' && firstImgObj.trim() !== '') {
      imgFileName = firstImgObj;
    }
  } 
  
  if (!imgFileName && p.image && typeof p.image === 'string' && p.image.trim() !== '') {
    imgFileName = p.image;
  }

  let constructedApiImageUrl = null;
  if (imgFileName && imgFileName !== 'null' && imgFileName !== 'undefined') {
    if (imgFileName.startsWith('http://') || imgFileName.startsWith('https://')) {
      constructedApiImageUrl = imgFileName;
    } else {
      // Append image filename to API storage path
      constructedApiImageUrl = `${API_PRODUCT_IMAGE_BASE}${imgFileName}`;
    }
  }

  const name = p.product_name || p.name || 'Product Name';
  const priceVal = p.retail_price || p.srate || p.mrp || p.wholesale_price || p.price || '0';

  // Extract timings info (e.g. breakfast, lunch, evening-snacks, start_time, end_time)
  const timingsList = Array.isArray(p.timings)
    ? p.timings.map((t) => ({
        id: t.id,
        sessionName: t.session_name || '',
        startTime: t.start_time || '',
        endTime: t.end_time || '',
      }))
    : [];

  // Extract badges (e.g. Bestseller, New Arrival)
  const badgesList = Array.isArray(p.badges)
    ? p.badges.map((b) => ({
        id: b.id,
        name: b.name || '',
        icon: b.icon || '',
      }))
    : [];

  // Food type data (e.g. Veg, Non Veg, Vegan)
  const foodTypeName = p.food_type_data && p.food_type_data.name ? p.food_type_data.name : null;

  // Manufacturer data
  const mfrName = p.manufacturer_data && p.manufacturer_data.name ? p.manufacturer_data.name : null;

  return {
    id: p.id || p.product_id,
    name: name,
    category: catName,
    subcategory: subCatName,
    price: `₹${parseFloat(priceVal).toFixed(0)}`,
    mrp: p.mrp ? `₹${parseFloat(p.mrp).toFixed(0)}` : null,
    stock: p.stock,
    unit: p.unit || 'PCS',
    description: p.description || '',
    image: constructedApiImageUrl, // Only holds URL if present in API
    timings: timingsList,
    badges: badgesList,
    foodType: foodTypeName,
    manufacturer: mfrName,
  };
}
