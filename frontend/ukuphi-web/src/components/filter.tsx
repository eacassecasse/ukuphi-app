import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export default function Filter({ placeholder, items, className }: { placeholder?: string; items: string[]; className?: string; }) {
    return (
        <Select>
            <SelectTrigger className={cn("w-[180px]", className)}>
                {placeholder ?
                    (<SelectValue placeholder={placeholder} />)
                    : (<SelectValue />)}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {
                        items.map((item, index) => (
                            <SelectItem key={index} value={item.toLocaleLowerCase()}>{item}</SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}