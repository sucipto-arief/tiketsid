/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
import Product from '../models/Product'
import db from '../utils/db'
import { Store } from '../utils/Store'

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.error('Sorry, Product is out of stock')
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart')
  }

  return (
    <Layout title='Home page'>
      <div className="hero min-w-screen bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl" style={{minHeight: '480px'}}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello tiketers</h1>
            <p className="mb-5">Beli tiket tanpa ribet.</p>
            <button className="primary-button">Browse events</button>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductItem product={product} key={product.slug}
            addToCartHandler={addToCartHandler}>
          </ProductItem>
        ))}
      </div>
    </Layout>
  );
}


export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  }
}