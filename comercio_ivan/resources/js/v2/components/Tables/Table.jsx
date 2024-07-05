import twMix from '@/v2/utils/twMix'

export default function Table({children, className = ''}) {
    return (
        <div className={twMix('overflow-x-scroll bg-white scrollbar-none', className)}>
            <table className="w-full">
                {children}
            </table>
        </div>
    );
}
