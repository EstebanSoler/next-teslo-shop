import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from '.';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { tesloApi } from '../../api';
import axios from 'axios';


export interface CartState {
  isLoaded: boolean,
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}


const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
}

interface Props {
  children: ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  // Efecto
  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
      console.log('cookieProducts', cookieProducts);

        dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts});
 
      
    } catch (error) {
      console.log('ERROR');
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: []});
    }
  }, []);

  useEffect(() => {
    if( Cookie.get('firstName')) {
      const shippingAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      }
      console.log('CART addrees', state.cart );
      dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress})
    }

  }, [])
  
  

  useEffect(() => {
    console.log('cart', state.cart);
    if(state.cart.length){
      Cookie.set('cart', JSON.stringify(state.cart))
    }
  }, [state.cart])

  useEffect(() => {
    const numberOfItems = state.cart.reduce( (prev, current) => current.quantity + prev, 0 );
    const subTotal = state.cart.reduce( (prev, current) => current.price * current.quantity + prev, 0 );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    
    const orderSumary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1 ),
    }
    console.log('CART', state.cart );
    dispatch({type: '[Cart] - Update order sumary', payload: orderSumary})
  }, [state.cart])
  

  const addProductToCart = ( product: ICartProduct) => {
    const productsInCart = state.cart.some( p => p._id === product._id);
    if( !productsInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product]});

    const productInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size );
    if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product]})

    // Acumular
    const updatedProducts = state.cart.map( p => {
      if( p._id !== product._id) return p;
      if( p.size !== product.size) return p;

      // actualizar cantidad
      p.quantity += product.quantity;
      return p;
    });

    dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts})
    
  }

  const updateCartQuantity = ( product: ICartProduct ) => {
    dispatch({type: '[Cart] - Change cart quantity', payload: product});
  }

  const removeCartProduct = ( product: ICartProduct ) => {
    dispatch({type: '[Cart] - Remove product in cart', payload: product});
  }

  const updateAddress = ( address: ShippingAddress ) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);
    dispatch({type: '[Cart] - Update Address', payload: address});
  }

  const createOrder = async(): Promise<{ hasError: boolean; message: string }> => {

    if( !state.shippingAddress ) {
      throw new Error('No hay dirección de entrega');
    }

    const body: IOrder = {
      orderItems: state.cart.map(p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
      paymentResult: ''
    }

    try {
      console.log(body);
      const { data } = await tesloApi.post('/orders', body);
      
      dispatch({ type: '[Cart] - Order complete'});

      return {
        hasError: false,
        message: data._id!
      }

    } catch (error) {
      if(axios.isAxiosError(error)){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }

      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }

      }
    }

  return(
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart,
      updateCartQuantity,
      removeCartProduct,
      updateAddress,

      // Orders
      createOrder,
    }}>
    { children}
    </CartContext.Provider>
  )
}