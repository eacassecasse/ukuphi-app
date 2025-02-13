import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  )
}

function ModalContent({ title, description, className, children }: { title?: string, description?: string; className?: string; children: React.ReactNode }) {
  return (
    <DialogContent className={cn(className)} aria-describedby={`${title ? "modal-" + title : ""}`}>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">{title || ''}</DialogTitle>
        {description && (<DialogDescription>{description}</DialogDescription>)}
      </DialogHeader>
      {children}
    </DialogContent>
  )
}

Modal.Button = DialogTrigger
Modal.Close = DialogClose
Modal.Content = ModalContent
