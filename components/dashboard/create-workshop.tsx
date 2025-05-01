import { useEffect, useState } from "react";
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
import { DateTimeInput } from "../ui/date-time-input";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { toast } from "sonner";

export default function CreateWorkshop({ refetch }: { refetch?: () => void }) {
  const trpc = useTRPC();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(Math.floor(Date.now() / 1000));

  const { mutate: createWorkshop, isPending } = useMutation(
    trpc.createWorkshop.mutationOptions({
      onSuccess: () => {
        refetch?.();
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    })
  );

  useEffect(() => {
    console.log(time);
  }, [time]);

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
          <Input
            id="name"
            placeholder="Workshop name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Workshop description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Price
          </label>
          <Input
            type="number"
            id="price"
            placeholder="Workshop price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </div>

        <div className="mt-3">
          <DateTimeInput
            id="time"
            label="Time (Local)"
            epochValue={time}
            onChange={setTime}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={() =>
              createWorkshop({
                name,
                description,
                price,
                time,
              })
            }
          >
            Add Workshop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
