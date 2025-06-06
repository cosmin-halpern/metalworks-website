import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Product } from "@/types";

interface QuoteFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProduct: string | null;
}

const QuoteFormDialog: React.FC<QuoteFormDialogProps> = ({ open, setOpen, selectedProduct }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    fetch("http://localhost:3001/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, product: selectedProduct }),
    })
      .then((res) => res.json())
      .then(() => setOpen(false));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

        {/* Modal Content */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none"
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-slate-800">
              Request Quote
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                name="name"
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition"
            >
              Send Request
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default QuoteFormDialog; 