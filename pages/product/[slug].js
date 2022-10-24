/* eslint-disable no-unused-vars */
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout'
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import toRupiah from '@develoka/angka-rupiah-js'

export default function ProductScreen(props) {
    const { product } = props;
    const { state, dispatch } = useContext(Store);
    const router = useRouter();
    if (!product) {
        return <Layout title='Product not found'>Product not found..</Layout>
    }

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        if (product.countInStock < quantity) {
            return toast.error('Sorry, Product is out of stock')
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
    }

    return (
        <Layout title={product.name}>
            <div className='py-2'>
                <Link href={'/'}>back to Home</Link>
            </div>
            <div className='grid md:grid-cols-4 md:gap-3'>
                <div className='md:col-span-2'>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout='responsive'
                    />
                </div>
                <div>
                    <ul>
                        <li>
                            <h1 className='text-lg font-bold'>{product.name}</h1>
                        </li>
                        <li className='flex'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                            {product.category}</li>
                        <li className='flex'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                            {product.star}</li>
                        <li>description: {product.description}</li>
                    </ul>
                </div>
                <div>
                    <div className='card p-5'>
                        <div className='mb-2 flex justify-between'>
                            <div>Price</div>
                            <div>{toRupiah(product.price, { dot: ',', formal: false, floatingPoint: 0 })}</div>
                        </div>
                        <div className='mb-2 flex justify-between'>
                            <div>Status</div>
                            <div>{product.countInStock > 0 ? 'In stock' : 'Unvailable'}</div>
                        </div>
                        <button className='primary-button w-full' onClick={addToCartHandler}>Pesan Tikets</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}


export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;

    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    return {
        props: {
            product: product ? db.convertDocToObj(product) : null,
        },
    }
}