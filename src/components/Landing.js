import { useState, useEffect, useMemo, memo } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ip from "./ip";

// Memoized ProductCard Component to prevent unnecessary re-renders
const ProductCard = memo(({ product }) => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleClick = () => {
    navigate(`/iteminfo/${product._id}`); // Navigate to the product detail page using _id
  };

  return (
    <a key={product.id} href="#" onClick={handleClick} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          alt={product.imageAlt}
          src={product.imageUrl}
          loading="lazy" // Lazy loading to improve performance
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">Bid Price: {product.bidPrice}</p>
      <p className="mt-1 text-sm text-gray-500">End Date: {product.endDate}</p>
    </a>
  );
});

export default function Example() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch products
        const response = await axios.post(
          ip + '/products',
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Fetch presigned URLs for each product image
        const productsWithUrls = await Promise.all(response.data.map(async (product) => {
          const imageUrlResponse = await axios.post(
            ip + '/imageurl',
            { image: product.imageSrc },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const Url = imageUrlResponse.data.url; // Assuming the URL is returned in the 'url' field

          return { ...product, imageUrl: Url };
        }));

        // Update state with the products including the presigned URLs
        setProducts(productsWithUrls);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to ensure this runs only once on mount

  // Memoize the products array to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {memoizedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}