import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store';

export default function PersonalDataScreen() {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
    } = useForm();

    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { personalData } = cart;
    const router = useRouter();

    useEffect(() => {
        setValue('fullName', personalData.fullName);
        setValue('emailAddress', personalData.emailAddress);
        setValue('phoneNumber', personalData.phoneNumber);
        setValue('identityNumber', personalData.identityNumber);
        setValue('location', personalData.location);
    }, [setValue, personalData])

    const submitHandler = ({ fullName, emailAddress, phoneNumber, identityNumber, location }) => {
        dispatch({
            type: 'SAVE_PERSONAL_DATA',
            payload: { fullName, emailAddress, phoneNumber, identityNumber, location },
        });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                personalData: {
                    fullName,
                    emailAddress,
                    phoneNumber,
                    identityNumber,
                    location,
                },
            })
        );
        router.push('/payment');
    };
    return (
        <Layout title='Order Details'>
            <CheckoutWizard activeStep={1} />
            <form
                className='mx-auto max-w-screen-md'
                onSubmit={handleSubmit(submitHandler)}
            >
                <h1 className='mb-4 text-xl'>Personal Data</h1>
                <div className='mb-4'>
                    <label htmlFor='fullName'>Full name</label>
                    <input
                        className='w-full'
                        id='fullName'
                        autoFocus
                        {...register('fullName', {
                            required: 'Please enter full name'
                        })}
                    />
                    {errors.fullName && (
                        <div className='text-red-500'>{errors.fullName.message}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label htmlFor='emailAddress'>Email</label>
                    <input
                        className='w-full'
                        id='emailAddress'
                        {...register('emailAddress', {
                            required: 'Please enter email',
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Please enter valid email'
                            },
                        })}
                    />
                    {errors.emailAddress && (
                        <div className='text-red-500'>{errors.emailAddress.message}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label htmlFor='phoneNumber'>Phone Number / Whatsapp</label>
                    <input
                        className='w-full'
                        id='phoneNumber'
                        {...register('phoneNumber', {
                            required: 'Please enter phone number',
                        })}
                    />
                    {errors.city && (
                        <div className='text-red-500'>{errors.city.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="identityNumber">NIK</label>
                    <input
                        className="w-full"
                        id="identityNumber"
                        {...register('identityNumber', {
                            required: 'Please enter postal code',
                        })}
                    />
                    {errors.identityNumber && (
                        <div className="text-red-500 ">{errors.identityNumber.message}</div>
                    )}
                </div>
                <div className='mb-4'>
                    <label htmlFor='location'>Location</label>
                    <input
                        className='w-full'
                        id='location'
                        {...register('location', {
                            required: 'Please enter location',
                        })}
                    />
                    {errors.location && (
                        <div className='text-red-500'>{errors.location.message}</div>
                    )}
                </div>
                <div className='mb-4 flex justify-between'>
                    <button className='primary-button'>Next</button>
                </div>
            </form>
        </Layout>
    )
}


PersonalDataScreen.auth = true;