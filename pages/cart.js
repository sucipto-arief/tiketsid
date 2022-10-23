import { useContext } from 'react'
import { Store } from '../utils/Store'
import Layout from '../components/Layout'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';
import toRupiah from '@develoka/angka-rupiah-js'

function CartScreen() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }
    const updateCartHandler = async (item, qty) => {
        const quantity = Number(qty);
        const { data } = await axios.get(`/api/products/${item._id}`)
        if (data.countInStock < quantity) {
            return toast.error('Sorry, Product is out of stock')
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
        toast.success('Product updated to the cart')
    };
    return (
        <Layout title='Shopping Cart'>
            <h1 className='mb-4 text-xl'>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    Keranjang kamu kosong. <Link href={'/'}>Cari Tikets</Link>
                </div>
            ) : (
                <div className='grid md:grid-cols-4 md:gap-5'>
                    <div className='overflow-x-auto md:col-span-3'>
                        <table className='min-w-full'>
                            <thead className='border-b'>
                                <tr>
                                    <th className='px-5 text-left'>Item</th>
                                    <th className='p-5 text-right'>Quantity</th>
                                    <th className='p-5 text-right'>Price</th>
                                    <th className='p-5'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.slug} className='border-b'>
                                        <td>
                                            <Link href={`/product/${item.slug}`}>
                                                <a className='flex items-center'>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    />
                                                    &nbsp;
                                                    {item.name}
                                                </a>
                                            </Link>
                                        </td>
                                        <td className='p-5 text-right'>
                                            <select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                                                {
                                                    [...Array(item.countInStock).keys()].map(x => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </td>
                                        <td className='p-5 text-right'>{toRupiah(item.price, { dot: ',', formal: false, floatingPoint: 0 })}</td>
                                        <td className='p-5 text-center'>
                                            <button onClick={() => removeItemHandler(item)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='card p-5'>
                        <ul>
                            <li>
                                <div className='pb-3 font-bold text-lg'>
                                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)})
                                    {' '}
                                    : 
                                    {toRupiah(cartItems.reduce((a, c) => a + c.quantity * c.price, 0),{ dot: ',', formal: false, floatingPoint: 0 })}
                                </div>
                            </li>
                            <li>
                                <button onClick={() => router.push('login?redirect=/personal-data')} className='primary-button w-full'>
                                    Check out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })