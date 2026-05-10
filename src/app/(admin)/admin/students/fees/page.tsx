"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, PlusCircle, CheckCircle2, Clock, IndianRupee, User, BookOpen, FileText, CalendarDays } from "lucide-react";
import { getAdminFeeData, addManualPayment } from "@/app/actions/admin-payment";
import { getAdminInvoices, payInstallment } from "@/app/actions/admin-invoice";
import { cn } from "@/lib/utils";

type Tab = "balances" | "invoices";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createInvoice } from "@/app/actions/admin-invoice";

export default function StudentFeesPage() {
    const [tab, setTab] = useState<Tab>("balances");

    // Balances State
    const [data, setData] = useState<{ students: any[], enrollments: any[], payments: any[] }>({
        students: [], enrollments: [], payments: []
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [manualAmounts, setManualAmounts] = useState<Record<string, number>>({});

    // Invoices State
    const [invoices, setInvoices] = useState<any[]>([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({
        studentId: "", courseId: "", totalAmount: 0, dueDate: "", installments: [{ amount: 0, dueDate: "" }], notes: ""
    });
    const [creating, setCreating] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [feeRes, invRes] = await Promise.all([
                getAdminFeeData({}),
                getAdminInvoices()
            ]);

            if (feeRes.success) {
                setData(feeRes.data);
            } else toast.error(feeRes.error || "Failed to load fee data");

            if (invRes.success) {
                setInvoices(invRes.invoices);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load fee data");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // ── Payment Logging ──
    const handleMarkPaid = async (userId: string, courseId: string, amount: number) => {
        if (!confirm(`Mark ₹${amount} as PAID manually?`)) return;
        try {
            const res = await addManualPayment({ userId, courseId, amount });
            if (res.success) {
                toast.success("Payment recorded!");
                loadData();
            } else toast.error(res.error || "Failed");
        } catch (error) { toast.error("Error confirming payment."); }
    };

    const handlePayInstallment = async (invoiceId: string, index: number, amt: number) => {
        if (!confirm(`Record manual payment of ₹${amt} for this installment?`)) return;
        try {
            const res = await payInstallment(invoiceId, index);
            if (res.success) {
                toast.success("Installment paid successfully!");
                loadData();
            } else toast.error(res.error || "Failed to pay installment");
        } catch (error) { toast.error("Server error"); }
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        const totalInstAmt = invoiceForm.installments.reduce((acc, inst) => acc + (inst.amount || 0), 0);
        if (totalInstAmt !== invoiceForm.totalAmount) {
            toast.error(`Installments (₹${totalInstAmt}) must exactly equal Total Amount (₹${invoiceForm.totalAmount})`);
            setCreating(false);
            return;
        }

        try {
            const res = await createInvoice({
                ...invoiceForm,
                dueDate: new Date(invoiceForm.dueDate),
                installments: invoiceForm.installments.map(i => ({ amount: i.amount, dueDate: new Date(i.dueDate) }))
            });

            if (res.success) {
                toast.success("Custom Invoice & Installments Created!");
                setOpenAdd(false);
                loadData();
            } else toast.error(res.error || "Failed");
        } catch (error) { toast.error("Server Error"); }
        setCreating(false);
    };

    // ── Aggregation For Balances Tab ──
    const studentFeeRecords: any[] = [];
    data.enrollments.forEach(en => {
        const student = data.students.find(s => s._id === en.userId);
        if (!student) return;

        const amount = en.courseId?.price || 0;
        const coursePayments = data.payments.filter(p => p.userId === student._id && p.courseId?._id === en.courseId?._id && p.status === "SUCCESS");
        const totalPaid = coursePayments.reduce((sum, p) => sum + p.amount, 0);
        const balance = amount - totalPaid;
        const isPaid = balance <= 0;

        studentFeeRecords.push({
            studentId: student._id,
            studentName: student.name,
            studentEmail: student.email,
            courseId: en.courseId?._id,
            courseName: en.courseId?.title,
            coursePrice: amount,
            totalPaid,
            balance,
            status: isPaid ? "PAID" : "PARTIAL"
        });
    });

    const filteredBalances = studentFeeRecords.filter(r =>
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.courseName?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredInvoices = invoices.filter(i =>
        i.studentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        i.invoiceNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Finance & Fee Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Track pending payments, offline collections, and structured installments.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-2xl font-bold bg-slate-900 border-2 border-slate-900 text-white shadow-lg hover:bg-slate-800">
                                <PlusCircle className="w-5 h-5 mr-2" /> Custom Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-8 border-none bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-slate-900">Create Installment Invoice</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateInvoice} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Student</label>
                                        <select
                                            required className="w-full h-12 bg-slate-50 border rounded-xl px-4 font-bold text-slate-700 outline-none"
                                            value={invoiceForm.studentId} onChange={e => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                                        >
                                            <option value="">-- Select Student --</option>
                                            {data.students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Course</label>
                                        <select
                                            required className="w-full h-12 bg-slate-50 border rounded-xl px-4 font-bold text-slate-700 outline-none"
                                            value={invoiceForm.courseId} onChange={e => {
                                                const enr = data.enrollments.find((en: any) => en.courseId?._id === e.target.value);
                                                setInvoiceForm({ ...invoiceForm, courseId: e.target.value, totalAmount: enr?.courseId?.price || invoiceForm.totalAmount })
                                            }}
                                        >
                                            <option value="">-- Select Course (From Enrollments) --</option>
                                            {Array.from(new Set(data.enrollments.map(e => e.courseId))).filter(Boolean).map((c: any) =>
                                                <option key={c._id} value={c._id}>{c.title} (₹{c.price})</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Total Amount</label>
                                        <Input required type="number" value={invoiceForm.totalAmount} onChange={e => setInvoiceForm({ ...invoiceForm, totalAmount: Number(e.target.value) })} className="h-12 border-slate-200 rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Final Due Date</label>
                                        <Input required type="date" value={invoiceForm.dueDate} onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} className="h-12 border-slate-200 rounded-xl font-bold" />
                                    </div>
                                </div>

                                <div className="pt-4 pb-2 border-b border-t mt-4 border-slate-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Payment Installments</label>
                                        <Button type="button" variant="outline" size="sm" onClick={() => setInvoiceForm({ ...invoiceForm, installments: [...invoiceForm.installments, { amount: 0, dueDate: "" }] })} className="rounded-lg h-7 text-[10px]"><PlusCircle className="w-3 h-3 mr-1" /> Add Phase</Button>
                                    </div>
                                    {invoiceForm.installments.map((inst, i) => (
                                        <div key={i} className="flex items-center gap-3 mb-3">
                                            <div className="flex-1 space-y-1">
                                                <Input required type="number" placeholder="Amt ₹" value={inst.amount} onChange={e => {
                                                    const newInsts = [...invoiceForm.installments];
                                                    newInsts[i].amount = Number(e.target.value);
                                                    setInvoiceForm({ ...invoiceForm, installments: newInsts });
                                                }} className="h-10 text-xs font-bold" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Input required type="date" value={inst.dueDate} onChange={e => {
                                                    const newInsts = [...invoiceForm.installments];
                                                    newInsts[i].dueDate = e.target.value;
                                                    setInvoiceForm({ ...invoiceForm, installments: newInsts });
                                                }} className="h-10 text-xs font-bold" />
                                            </div>
                                            {invoiceForm.installments.length > 1 && (
                                                <Button type="button" variant="ghost" onClick={() => {
                                                    const newInsts = invoiceForm.installments.filter((_, idx) => idx !== i);
                                                    setInvoiceForm({ ...invoiceForm, installments: newInsts });
                                                }} className="h-10 text-red-400 hover:text-red-600">X</Button>
                                            )}
                                        </div>
                                    ))}
                                    <p className="text-[10px] text-right text-slate-400 font-bold uppercase mt-2">
                                        Remaining bal check: ₹{(invoiceForm.totalAmount - invoiceForm.installments.reduce((sum, inst) => sum + (inst.amount || 0), 0))}
                                    </p>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Invoice Terms / Notes</label>
                                    <Input value={invoiceForm.notes} placeholder="e.g. Late fee of Rs 500 applies past due date." onChange={e => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} className="h-12 border-slate-200 rounded-xl" />
                                </div>

                                <Button type="submit" disabled={creating} className="w-full h-14 mt-4 rounded-xl text-lg font-black bg-primary">
                                    {creating ? "Creating Ledger..." : "Generate Invoice Structure"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
                {([
                    { id: "balances", label: "Overall Balances", icon: BookOpen },
                    { id: "invoices", label: "Invoices & Installments", icon: FileText },
                ] as const).map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                            tab === id ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <Icon className="w-4 h-4" /> {label}
                    </button>
                ))}
            </div>

            <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm pt-2">
                <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Find student, course, or invoice..."
                            className="w-full h-12 bg-white border rounded-xl pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading financial ledgers...</div>
                    ) : tab === "balances" ? (
                        <table className="w-full text-left font-medium">
                            <thead>
                                <tr className="border-b text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50">
                                    <th className="px-8 py-4">Student</th>
                                    <th className="px-8 py-4">Course</th>
                                    <th className="px-8 py-4">Status & Ledger</th>
                                    <th className="px-8 py-4 text-right">Offline Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-600">
                                {filteredBalances.length === 0 && (
                                    <tr><td colSpan={4} className="p-12 text-center text-slate-400">No balances found.</td></tr>
                                )}
                                {filteredBalances.map((record, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{record.studentName}</p>
                                                    <p className="text-[10px] uppercase font-bold text-slate-400">{record.studentEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm">
                                            <p className="font-bold text-slate-800 line-clamp-1">{record.courseName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Total: ₹{record.coursePrice}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            {record.status === "PAID" ? (
                                                <div className="flex flex-col gap-1.5 object-left">
                                                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded w-fit uppercase">
                                                        <CheckCircle2 className="w-3 h-3" /> Fully Paid
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded w-fit uppercase">
                                                        <Clock className="w-3 h-3" /> Pending (Bal: ₹{record.balance})
                                                    </span>
                                                    <div className="w-full max-w-[120px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(record.totalPaid / record.coursePrice) * 100}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            {record.status !== "PAID" && (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 h-10 w-28 text-left focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                                                        <span className="text-slate-400 font-bold text-xs pl-1">₹</span>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 h-full"
                                                            placeholder={String(record.balance)}
                                                            value={manualAmounts[`${record.studentId}-${record.courseId}`] || ""}
                                                            onChange={(e) => setManualAmounts({
                                                                ...manualAmounts,
                                                                [`${record.studentId}-${record.courseId}`]: Number(e.target.value)
                                                            })}
                                                        />
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold gap-2 text-xs rounded-xl h-10 px-4 whitespace-nowrap shadow-none"
                                                        onClick={() => {
                                                            const key = `${record.studentId}-${record.courseId}`;
                                                            const amountToPay = manualAmounts[key] ? manualAmounts[key] : record.balance;
                                                            if (amountToPay > record.balance) return toast.error(`Max balance is ₹${record.balance}`);
                                                            handleMarkPaid(record.studentId, record.courseId, amountToPay);
                                                        }}
                                                    >
                                                        Pay
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left font-medium">
                            <thead>
                                <tr className="border-b text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50">
                                    <th className="px-8 py-4">Invoice ID</th>
                                    <th className="px-8 py-4">Student & Course</th>
                                    <th className="px-8 py-4">Total / Balance</th>
                                    <th className="px-8 py-4 w-1/3">Installment Breakdown</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-600">
                                {filteredInvoices.length === 0 ? (
                                    <tr><td colSpan={4} className="p-16 text-center text-slate-400">
                                        <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="font-bold">No Custom Invoices Found</p>
                                        <p className="text-xs max-w-sm mx-auto mt-1">Break down a course fee into fixed payment dates by creating a Custom Invoice.</p>
                                    </td></tr>
                                ) : filteredInvoices.map((inv: any) => (
                                    <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                {inv.invoiceNumber}
                                            </span>
                                            {inv.status === "PAID" && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-2" />}
                                            {inv.status === "PARTIAL" && <span className="text-[10px] font-bold text-amber-500 block mt-1 uppercase tracking-wider">Partial</span>}
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-900 line-clamp-1">{inv.studentId?.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{inv.courseId?.title}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-900">₹{inv.totalAmount}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                                                Bal: <span className="text-red-400">₹{inv.balanceDue}</span>
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-2">
                                                {inv.installments.map((inst: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white border rounded-xl p-2.5 text-xs font-bold text-slate-600">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px]">{idx + 1}</div>
                                                            <div className="flex flex-col">
                                                                <span>₹{inst.amount}</span>
                                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                                    <CalendarDays className="w-2.5 h-2.5" />
                                                                    {new Date(inst.dueDate).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {inst.status === "PAID" ? (
                                                            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1 text-[10px] uppercase font-black tracking-wider">
                                                                <CheckCircle2 className="w-3 h-3" /> Paid
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handlePayInstallment(inv._id, idx, inst.amount)}
                                                                className="h-7 text-[10px] uppercase tracking-wider font-black rounded-lg px-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-none transition-colors border border-red-100"
                                                            >
                                                                Collect
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
