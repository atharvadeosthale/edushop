import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function CreateWorkshop({ refetch }: { refetch?: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Workshop</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Workshop</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Add a new workshop to your dashboard. You can then share an unique
          link to this workshop where your customers can make purchases.
        </DialogDescription>

        <div className="mt-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Name
          </label>
          <Input id="name" placeholder="Workshop name" />
        </div>

        <div className="mt-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Description
          </label>
          <Textarea id="description" placeholder="Workshop description" />
        </div>

        <div className="mt-3">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Price
          </label>
          <Input id="price" placeholder="Workshop price" />
        </div>

        <div className="mt-3">
          <label
            htmlFor="time"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Time (Local)
          </label>
          <Input id="time" type="datetime-local" />
        </div>
        <DialogFooter>
          <Button>Add Workshop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
