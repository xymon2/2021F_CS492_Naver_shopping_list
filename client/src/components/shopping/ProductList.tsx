import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getProducts, getProductsFromMenu } from '../../lib/api/shopping';
import Product, { ProductInfoProps } from './Product';
import './ProductList.css';

const ProductList = () => {
  const [page, setPage] = useState<number>(0);
  const [ProductList, setProductList] = useState<ProductInfoProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, sethasMore] = useState<boolean>(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const { channelID } = useParams<{ channelID: string }>();
  const query = new URLSearchParams(useLocation().search);
  let menuID: string | null = '';
  if (query.get('submenu') !== null) {
    menuID = query.get('submenu');
  } else if (query.get('menu') !== null) {
    menuID = query.get('menu');
  } else if (query.get('category') !== null) {
    menuID = query.get('category');
  }

  useEffect(() => {
    async function sendQuery() {
      setLoading(true);
      setPage(0);
      setProductList([]);
      // sethasMore(true);
      const res = await getProductsFromMenu(channelID, menuID, 1);
      setProductList(res.data);
      if (res.data.length < 8) {
        sethasMore(false);
        // sethasMore(true);
      } else {
        sethasMore(true);
      }
      setLoading(false);
    }
    sendQuery();
  }, [channelID, menuID, useLocation().search]);

  useEffect(() => {
    async function sendQuery2() {
      if (hasMore && page > 1) {
        setLoading(true);
        const res = await getProductsFromMenu(channelID, menuID, page);
        setProductList((prev) => [...prev, ...res.data]);
        if (res.data.length < 8) {
          sethasMore(false);
        } else {
          sethasMore(true);
        }
        setLoading(false);
      }
    }
    sendQuery2();
  }, [page, channelID, hasMore, menuID, useLocation().search]);

  //loader와 intersect하면 page를 increase함
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      // console.log("page: %d", page);
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '10px',
      threshold: 1,
    };
    // if(hasMore){
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    // }
  }, [handleObserver]);

  //프로덕트리스트로 프로덕트 컴포넌트의 리스트를 만듭니다.
  return (
    <div className="productList">
      <h1>Product List</h1>
      <div className="products">
        {ProductList.map((product) => {
          return <Product info={product} key={product['_id']} />;
        })}
      </div>
      <div className="atEnd">
        <div ref={loader} />
        {loading && <p>Loading...</p>}
        {!hasMore && <h4>End of List</h4>}
      </div>
    </div>
  );
};

export default ProductList;
