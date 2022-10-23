import Cookies from 'js-cookie';
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store';

export default function PaymentScreen() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { personalData, paymentMethod } = cart;
    const router = useRouter();

    const submitHandler = (e) => {
        e.preventDefault();
        if (!selectedPaymentMethod) {
            return toast.error('Payment method is required');
        }
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                paymentMethod: selectedPaymentMethod,
            })
        );

        router.push('/placeorder');
    };

    useEffect(() => {
        if (!personalData.emailAddress) {
            return router.push('/personal-data');
        }
        setSelectedPaymentMethod(paymentMethod || '');
    }, [paymentMethod, router, personalData.emailAddress])
    return (
        <Layout title='Payment Method'>
            <CheckoutWizard activeStep={2} />
            <form className='mx-auto max-w-screen-md' onSubmit={submitHandler}>
                <h1 className='mb-4 text-xl'>Payment Method</h1>
                {
                    ['Paypal', 'Stripe', 'CashOnDelivery'].map((payment) => (
                        <div key={payment} className='mb-4'>
                            <input
                                name='paymentMethod'
                                className='p-2 outline-none focus:ring-0'
                                id={payment}
                                type='radio'
                                checked={selectedPaymentMethod === payment}
                                onChange={() => setSelectedPaymentMethod(payment)}
                            />
                            <label className='p-2' htmlFor={payment}>
                                {payment}
                            </label>
                        </div>
                    ))}
                <div className='mb-4 flex justify-between'>
                    <button
                        onClick={() => router.push('/personal-data')}
                        type='button'
                        className='default-button'
                    >
                        Back
                    </button>
                    <button className='primary-button'>Next</button>
                </div>
            </form>
        </Layout>
    )
}

PaymentScreen.auth = true