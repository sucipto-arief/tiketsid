/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import toRupiah from '@develoka/angka-rupiah-js';

export default function ProductItem({ product, addToCartHandler }) {
    return (
        <div className='card'>
            <Link href={`/product/${product.slug}`}>
                <a>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="rounded shadow object-cover h-64 w-full"
                    />
                </a>
            </Link>
            <div className='flex flex-col items-center justify-center p-5'>
                <Link href={`/product/${product.slug}`}>
                    <a>
                        <h2 className='text-lg'>{product.name}</h2>
                    </a>
                </Link>
                <p className='mb-2'>{product.star}</p>
                <p className='mb-2 font-bold'>{toRupiah(product.price, { dot: ',', formal: false, floatingPoint: 0 })}</p>
                <button
                    className='primary-button'
                    type='button'
                    onClick={() => addToCartHandler(product)}
                >
                    Pesan Tikets
                </button>
            </div>
        </div>
    );
}
