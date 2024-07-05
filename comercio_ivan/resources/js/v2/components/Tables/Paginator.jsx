import twMix from '@/v2/utils/twMix'

export default function Column({paginator, onPageChange, className = ''}) {

    const onClick = (link) => {
        if (link.label) {
            let page = parseInt(link.label)
            if (link.label == 'Siguiente &raquo;') {
                page = paginator.current_page + 1
            }
            if (link.label == '&laquo; Anterior') {
                page = paginator.current_page - 1
            }
            onPageChange(page)
        }
    }

    let baseClass = `size-8 border focus:outline-none focus:ring-0 cursor-pointer`;

    return (
        <div className={twMix('flex items-center gap-2 w-fit overflow-hidden', className)}>
            {paginator.links.map((link, index) =>
                <button disabled={link.url === null}
                        key={index}
                        onClick={() => onClick(link)}
                        className={`${baseClass} ${(link.active ? 'bg-app text-white' : 'bg-white')}`}
                        dangerouslySetInnerHTML={{__html: link.label}}>
                </button>
            )}
        </div>
    );
}
