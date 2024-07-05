import twMix from '@/v2/utils/twMix'

export default function Column({header = false, children, className = '', colSpan}) {

    let cssClass = 'px-3 py-3 md:px-6 2xl:px-7.5 tracking-wider'

    if(header){
        cssClass += 'bg-[#fafafa] font-medium'
    }

    return (
        <td colSpan={colSpan} className={twMix(cssClass, className)}>
            {children}
        </td>
    );
}
