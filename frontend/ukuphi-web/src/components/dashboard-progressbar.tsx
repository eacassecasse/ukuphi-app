interface ProgressBarProps {
    value: number;
    total: number;
}
export default function ProgressBar({ value, total }: ProgressBarProps) {
    const percentage = Math.round((value / total) * 100);
    const curIndex = Math.min(Math.floor(percentage / 20), 4);
    return (
        <div className="flex flex-col gap-[1px] justify-center items-center">
            {
                Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className={`${index === 0 ? 'w-[5px] h-[5px]  bg-neutral-600' : index === curIndex ? 'w-[7px] h-[7px] bg-byzantine-blue' : 'w-[5px] h-[5px] bg-gray-300'} rounded-full`} />
                ))
            }
        </div>
    )
}