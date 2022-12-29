import Head from 'next/head'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import React, { useContext, useEffect, useState, useRef } from 'react'
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store'
import { Menu } from '@headlessui/react'
import DropdownLink from '../components/DropdownLink'
import Cookies from 'js-cookie'

export default function Layout({ title, children }) {
    const tawkMessengerRef = useRef();
    const { status, data: session } = useSession();
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [cartItemsCount, setcartItemsCount] = useState(0);
    useEffect(() => {
        setcartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
    }, [cart.cartItems]);

    const logutClickHandler = () => {
        Cookies.remove('cart');
        dispatch({ type: 'CART_RESET' })
        signOut({ callbackUrl: '/login' });
    }

    return (
        <>
            <Head>
                <title>{title ? title + ' - Tikets.id' : 'Tikets.id'}</title>
                <meta name="description" content="Tikets.id Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer position='bottom-center' limit={1} />

            <div className='flex min-h-screen flex-col justify-between bg-neutral-50'>
                <header>
                    <nav className='flex h-12 items-center px-4 justify-between shadow-lg bg-slate-700'>
                        <Link href={'/'}>
                            <a className='text-2xl ml-4 font-bold'>tikets.id</a>
                        </Link>
                        <div>
                            <Link href={'/cart'}>
                                <a className='p-2 mr-4'>
                                    Cart
                                    {cartItemsCount > 0 && (
                                        <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </a>
                            </Link>
                            {status === 'loading' ? (
                                'Loading'
                            ) : session?.user ? (
                                <Menu as='div' className='relative inline-block'>
                                    <Menu.Button className='text-yellow-500'>
                                        {session.user.name}
                                    </Menu.Button>
                                    <Menu.Items className='absolute right-0 w-56 origin-top-right bg-white shadow-lg rounded-xl'>
                                        <Menu.Item>
                                            <DropdownLink className='dropdown-link' href={'/profile'}>
                                                Update Profile
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink
                                                className='dropdown-link'
                                                href={'/order-history'}
                                            >
                                                Order history
                                            </DropdownLink>
                                        </Menu.Item>
                                        {session.user.isAdmin && (
                                            <Menu.Item>
                                                <DropdownLink
                                                    className="dropdown-link"
                                                    href="/admin/dashboard"
                                                >
                                                    Admin Dashboard
                                                </DropdownLink>
                                            </Menu.Item>
                                        )}
                                        <Menu.Item>
                                            <a
                                                className='dropdown-link'
                                                href='#'
                                                onClick={logutClickHandler}
                                            >
                                                Logout
                                            </a>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            ) : (
                                <Link href={'/login'}>
                                    <a className='p-2 mr-4'>Login</a>
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <main className='container m-auto mt-4 px-4'>{children}</main>
                <div>
                    <TawkMessengerReact
                        propertyId='6356802fdaff0e1306d3a9ac'
                        widgetId='1gg4u9f2b'
                        useRef={tawkMessengerRef} />
                </div>
                <footer className='flex h-10 justify-center items-center shadow-inner'>
                    <p>Copyright © 2022 - All right reserved by <Link href={'/'} passHref><a>tikets.id</a></Link></p>
                </footer>
            </div>
        </>
    )
}
