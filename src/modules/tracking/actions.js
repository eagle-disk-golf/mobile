import {createNamespace, fsa} from '../../helpers/action';


const ns = createNamespace('tracking');

export const SET_COUNT = ns('SET_COUNT');
export const setCount = count => fsa(SET_COUNT, count);

export const INCREMENT = ns('INCREMENT');
export const increment = () => fsa(INCREMENT);

export const DECREMENT = ns('DECREMENT');
export const decrement = () => fsa(DECREMENT);