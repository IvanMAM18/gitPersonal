import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function twMix(...args) {
    return twMerge(clsx(...args));
}
