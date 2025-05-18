import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "client/src/components/ui/dialog.jsx";
import { Button } from "client/src/components/ui/button.jsx";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function QuoteFormDialog({ open, setOpen, selectedProduct }) {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | success | error

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");

        const payload = { ...formData, product: selectedProduct };

        try {
            const res = await fetch("http://localhost:5050/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed");

            setStatus("success");
            setFormData({ name: "", email: "", message: "" });

            // Auto-close modal after 3 seconds
            setTimeout(() => {
                setStatus("idle");
                setOpen(false);
            }, 3000);
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) setStatus("idle");
            setOpen(open);
        }}>
            <DialogContent className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle>Request a Quote</DialogTitle>
                </DialogHeader>

                {status === "success" ? (
                    <div className="text-center py-10">
                        <CheckCircle2 className="text-green-600 w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">Quote sent successfully!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="product"
                            value={selectedProduct}
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                        <input
                            name="name"
                            required
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Your name"
                            onChange={handleChange}
                            value={formData.name}
                        />
                        <input
                            name="email"
                            required
                            type="email"
                            className="w-full border rounded px-3 py-2"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            value={formData.email}
                        />
                        <textarea
                            name="message"
                            required
                            rows="4"
                            className="w-full border rounded px-3 py-2 resize-none"
                            placeholder="Tell us about your project..."
                            onChange={handleChange}
                            value={formData.message}
                        />
                        <Button type="submit" className="w-full flex justify-center items-center" disabled={status === "sending"}>
                            {status === "sending" ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...
                                </>
                            ) : (
                                "Send Request"
                            )}
                        </Button>
                        {status === "error" && (
                            <p className="text-red-600 text-sm mt-2">Something went wrong. Please try again.</p>
                        )}
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
