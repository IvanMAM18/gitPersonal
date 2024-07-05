import twMix from '@/v2/utils/twMix'

export default function Row({header, hover, children, className = '', onClick = null}) {


    let cssClass = 'border-b border-[#f0f0f0]'

    if (header) {
        cssClass += ' bg-[#fafafa]'
    }

    if (hover) {
        cssClass += ' hover:bg-[#fafafa]'
    }

    if(onClick) {
        cssClass += ''
    }

    return (
        <tr onClick={onClick} className={twMix(cssClass, className)}>
            {children}
        </tr>
    );
}
