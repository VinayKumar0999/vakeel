"use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { DayPicker } from "react-day-picker";
// //import { consultationAPI, lawyerAPI, paymentAPI } from "@/lib/api";
// import toast from "react-hot-toast";
// import { Header } from "@/components/layout/header";
// import { Footer } from "@/components/layout/footer";

// interface Slot {
//   start: string; // "09:00:00"
//   end: string;   // "09:30:00"
// }

// export default function BookingPage({ params }: { params: { lawyerId: string } }) {
//   const router = useRouter();
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
//   const [caseTitle, setCaseTitle] = useState("");
//   const [caseDesc, setCaseDesc] = useState("");
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [booking, setBooking] = useState(false);
//   const [lawyerName, setLawyerName] = useState<string>("Lawyer");

//   useEffect(() => {
//     async function fetchLawyer() {
//       try {
//         const res = await lawyerAPI.getById(params.lawyerId);
//         setLawyerName(res.data?.data?.name || res.data?.name || "Lawyer");
//       } catch (e) {
//         // ignore
//       }
//     }
//     fetchLawyer();
//   }, [params.lawyerId]);

//   useEffect(() => {
//     if (!selectedDate) return;
//     // Fetch available slots for the selectedDate and lawyer
//     async function fetchSlots() {
//       setLoadingSlots(true);
//       try {
//         // TODO: Replace with real endpoint: /lawyers/:id/availability or consultations/available-slots
//         const formatted = selectedDate!.toISOString().split("T")[0];
//         const res = await lawyerAPI.getAvailability(params.lawyerId, formatted);
//         // Expect res.data.data = [{start: "09:00:00", end: "09:30:00"}, ...]
//         setSlots(res.data.data || res.data || []);
//       } catch (err) {
//         console.error("Failed to load slots", err);
//         // fallback dummy slots
//         setSlots([
//           { start: "09:00:00", end: "09:30:00" },
//           { start: "10:00:00", end: "10:30:00" },
//           { start: "15:00:00", end: "15:30:00" },
//         ]);
//       } finally {
//         setLoadingSlots(false);
//       }
//     }
//     fetchSlots();
//   }, [selectedDate, params.lawyerId]);

//   async function handleBook() {
//     if (!selectedDate || !selectedSlot) {
//       toast.error("Please select date and time slot");
//       return;
//     }
//     if (!caseTitle) {
//       toast.error("Please enter a case title");
//       return;
//     }

//     setBooking(true);
//     try {
//       const payload = {
//         lawyerId: Number(params.lawyerId),
//         scheduledDate: selectedDate.toISOString().split("T")[0],
//         scheduledStartTime: selectedSlot.start,
//         scheduledEndTime: selectedSlot.end,
//         durationMinutes: 30,
//         consultationType: "VIDEO",
//         caseTitle,
//         caseDescription: caseDesc,
//         // payment flow: create order, then client pays on frontend using gateway
//       };

//       // Create booking (creates consultation and returns order to pay)
//       const res = await consultationAPI.book(payload);
//       // response: { data: { consultation, paymentOrder } }
//       const consultation = res.data?.data?.consultation || res.data?.consultation;
//       // TODO: if payment required, redirect to payment flow or handle Razorpay
//       toast.success("Consultation created. Proceed to payment.");
//       router.push(`/dashboard/consultations/${consultation?.id || ""}`);
//     } catch (err: any) {
//       console.error("Booking failed", err);
//       toast.error(err?.response?.data?.message || "Booking failed.");
//     } finally {
//       setBooking(false);
//     }
//   }

//   return (
//     <>
//       <Header />
//       <main className="container mx-auto px-4 py-10">
//         <div className="max-w-3xl mx-auto">
//           <Card>
//             <CardHeader className="p-6">
//               <CardTitle>Book Consultation with {lawyerName}</CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-4">
//               <div>
//                 <Label>Choose a date</Label>
//                 <div className="mt-2">
//                   <DayPicker
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={setSelectedDate}
//                     fromDate={new Date()}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>Available time slots</Label>
//                 <div className="mt-2 grid grid-cols-2 gap-2">
//                   {loadingSlots ? (
//                     <div>Loading slots...</div>
//                   ) : slots.length === 0 ? (
//                     <div className="text-gray-600">No slots available for selected date</div>
//                   ) : (
//                     slots.map((s, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => setSelectedSlot(s)}
//                         className={`px-3 py-2 rounded-lg border text-sm ${selectedSlot === s ? "bg-primary-600 text-white" : "bg-white hover:bg-gray-50"}`}
//                       >
//                         {s.start} - {s.end}
//                       </button>
//                     ))
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <Label>Case Title</Label>
//                 <Input value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} placeholder="Brief title of your case" />
//               </div>

//               <div>
//                 <Label>Case Description (optional)</Label>
//                 <textarea value={caseDesc} onChange={(e) => setCaseDesc(e.target.value)} className="w-full border rounded p-2" rows={4} placeholder="Describe your issue..." />
//               </div>

//               <div className="flex justify-end">
//                 <Button onClick={handleBook} disabled={booking}>
//                   {booking ? "Booking..." : "Confirm & Pay"}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, FileText, CreditCard, CheckCircle, Upload, X, ChevronRight, ChevronLeft, User, Loader2 } from 'lucide-react';
import { lawyerAPI, bookingAPI } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import toast from 'react-hot-toast';

const DURATION_MIN = 30;
const PLATFORM_FEE = 50;

function getDatesForCalendar() {
  const out: { date: string; day: string; available: boolean }[] = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    let dayLabel: string;
    if (i === 0) dayLabel = 'Today';
    else if (i === 1) dayLabel = 'Tomorrow';
    else dayLabel = `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${day}`;
    out.push({ date: dateStr, day: dayLabel, available: true });
  }
  return out;
}

const TIME_SLOTS = {
  morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  afternoon: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
  evening: ['05:00 PM', '05:30 PM', '06:00 PM'],
};

function slotToMinutes(slot: string): number {
  const match = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return (h ?? 0) * 60 + (m ?? 0);
}

function isSlotBlocked(
  slotDisplay: string,
  bookedSlots: { start: string; durationMinutes: number }[],
  slotDurationMinutes: number
): boolean {
  const slotStartM = slotToMinutes(slotDisplay);
  if (slotStartM < 0) return false;
  for (const b of bookedSlots) {
    const startM = timeToMinutes(b.start);
    const endM = startM + (b.durationMinutes ?? 30);
    const slotEndM = slotStartM + slotDurationMinutes;
    if (slotStartM < endM && slotEndM > startM) return true;
  }
  return false;
}

export default function BookingFlow() {
  const params = useParams();
  const router = useRouter();
  const advocateId = params?.lawyerId as string;

  const [advocate, setAdvocate] = useState<{ id: string; name: string; photo: string | null; expertise: string[]; fee: number } | null>(null);
  const [loadingAdvocate, setLoadingAdvocate] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{ start: string; durationMinutes: number }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const dates = useMemo(() => getDatesForCalendar(), []);

  function timeTo24(slot: string): string {
    const match = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return "09:00";
    let h = parseInt(match[1], 10);
    const m = match[2];
    if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${m}:00`;
  }

  async function handleConfirmBooking() {
    if (!selectedDate || !selectedSlot || !advocateId || !advocate) return;
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to book a consultation.");
      router.push(`/login?redirect=${encodeURIComponent(`/book/${advocateId}`)}`);
      return;
    }
    setIsBooking(true);
    try {
      await bookingAPI.create({
        lawyerId: advocateId,
        scheduledDate: selectedDate,
        scheduledTime: timeTo24(selectedSlot),
        durationMinutes: DURATION_MIN,
        consultationFee: lawyer.fee,
        notes: description || undefined,
      });
      toast.success("Booking confirmed! It will appear in your dashboard.");
      router.push("/dashboard/client");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  }

  const steps = [
    { number: 1, title: 'Date & Time', icon: Calendar },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Review', icon: CheckCircle },
    { number: 4, title: 'Payment', icon: CreditCard }
  ];

  useEffect(() => {
    if (!advocateId) return;
    (async () => {
      setLoadingAdvocate(true);
      try {
        const res = await lawyerAPI.getById(advocateId);
        const raw = res.data?.data || res.data;
        if (raw) {
          setAdvocate({
            id: raw.id,
            name: raw.name || 'Advocate',
            photo: raw.photo || null,
            expertise: Array.isArray(raw.expertise) ? raw.expertise : [raw.expertise].filter(Boolean),
            fee: typeof raw.fee === 'number' ? raw.fee : parseFloat(raw.fee) || 0,
          });
        }
      } catch (e) {
        console.error('Failed to load advocate', e);
      } finally {
        setLoadingAdvocate(false);
      }
    })();
  }, [advocateId]);

  useEffect(() => {
    if (!advocateId || !selectedDate) {
      setBookedSlots([]);
      setSelectedSlot(null);
      return;
    }
    setSelectedSlot(null);
    setLoadingSlots(true);
    lawyerAPI
      .getAvailability(advocateId, selectedDate)
      .then((res) => {
        setBookedSlots(res.data?.bookedSlots ?? []);
      })
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [advocateId, selectedDate]);

  const lawyer = advocate ? {
    name: advocate.name,
    photo: advocate.photo,
    expertise: advocate.expertise?.length ? advocate.expertise.join(', ') : 'Legal consultation',
    fee: advocate.fee,
    duration: DURATION_MIN
  } : { name: 'Advocate', photo: null, expertise: '—', fee: 0, duration: DURATION_MIN };

  const timeSlots = TIME_SLOTS;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedDate && selectedSlot;
    if (currentStep === 2) return description.trim().length > 0;
    if (currentStep === 3) return agreed;
    return true;
  };

  if (!advocateId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <p className="text-slate-600">Invalid booking link.</p>
        <Link href="/advocates" className="text-vk-primary font-medium hover:underline">Browse advocates</Link>
      </div>
    );
  }

  if (loadingAdvocate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-vk-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading advocate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-vk-primary">Vakeel Kutami</Link>
            <Link
              href={advocateId ? `/advocates/${advocateId}` : '/advocates'}
              className="text-slate-600 hover:text-slate-900"
            >
              Cancel Booking
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-10">
              <div
                className="h-full bg-vk-primary transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-vk-primary text-white'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Date & Time</h2>
                  <p className="text-slate-600 mb-6">Choose your preferred consultation slot</p>

                  {/* Date Selection */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 mb-4">Select Date</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {dates.map((d) => (
                        <button
                          key={d.date}
                          disabled={!d.available}
                          onClick={() => setSelectedDate(d.date)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            !d.available
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : selectedDate === d.date
                              ? 'border-vk-primary bg-vk-primary/10 text-vk-primary'
                              : 'border-slate-300 hover:border-vk-primary hover:bg-vk-primary/5'
                          }`}
                        >
                          <div className="font-semibold">{d.day}</div>
                          <div className="text-sm mt-1">{d.date.split('-')[2]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-4">Select Time Slot</h3>
                      {loadingSlots && (
                        <p className="text-sm text-slate-500 mb-2">Checking availability...</p>
                      )}
                      <div className="space-y-4">
                        {Object.entries(timeSlots).map(([period, slots]) => (
                          <div key={period}>
                            <div className="text-sm font-medium text-slate-600 mb-2 capitalize">{period}</div>
                            <div className="grid grid-cols-4 gap-3">
                              {slots.map((slot) => {
                                const blocked = isSlotBlocked(slot, bookedSlots, DURATION_MIN);
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={blocked}
                                    onClick={() => !blocked && setSelectedSlot(slot)}
                                    className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                                      blocked
                                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : selectedSlot === slot
                                        ? 'border-vk-primary bg-vk-primary/10 text-vk-primary'
                                        : 'border-slate-300 hover:border-vk-primary hover:bg-vk-primary/5'
                                    }`}
                                  >
                                    {blocked ? `${slot} (Booked)` : slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Consultation Details */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Consultation Details</h2>
                  <p className="text-slate-600 mb-6">Provide information about your legal matter</p>

                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <label className="block font-medium text-slate-900 mb-2">
                        Brief Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your legal issue or what you'd like to discuss during the consultation..."
                        rows={6}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vk-primary focus:border-transparent"
                      />
                      <div className="text-sm text-slate-500 mt-1">
                        {description.length}/500 characters
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block font-medium text-slate-900 mb-2">
                        Upload Documents (Optional)
                      </label>
                      <p className="text-sm text-slate-600 mb-3">
                        Upload any relevant documents (Max 5 files, 10MB each)
                      </p>
                      
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-vk-primary hover:bg-vk-primary/5 transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                          <div className="font-medium text-slate-700">Click to upload files</div>
                          <div className="text-sm text-slate-500 mt-1">PDF, DOC, JPG, PNG</div>
                        </label>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file:any, idx:number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-vk-primary/10 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-vk-primary" />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 text-sm">{file.name}</div>
                                  <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</div>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(idx)}
                                className="w-8 h-8 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <X className="w-4 h-4 text-slate-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block font-medium text-slate-900 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        placeholder="Any other information you'd like the lawyer to know beforehand..."
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vk-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Confirm</h2>
                  <p className="text-slate-600 mb-6">Please review your booking details</p>

                  <div className="space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Consultation Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date</span>
                          <span className="font-medium text-slate-900">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Time</span>
                          <span className="font-medium text-slate-900">{selectedSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Duration</span>
                          <span className="font-medium text-slate-900">{lawyer.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Type</span>
                          <span className="font-medium text-slate-900">Video Consultation</span>
                        </div>
                      </div>
                    </div>

                    {/* Case Details */}
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h3 className="font-semibold text-slate-900 mb-3">Case Details</h3>
                      <p className="text-slate-700 leading-relaxed">{description}</p>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-slate-700 mb-2">Attached Documents:</div>
                          <div className="space-y-1">
                            {uploadedFiles.map((file:any, idx:number) => (
                              <div key={idx} className="text-sm text-slate-600">• {file.name}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Terms & Conditions */}
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="w-5 h-5 text-vk-primary rounded mt-0.5"
                        />
                        <span className="text-sm text-slate-700">
                          I agree to the <a href="#" className="text-vk-primary hover:underline">Terms & Conditions</a> and <a href="#" className="text-vk-primary hover:underline">Privacy Policy</a>. I understand that this consultation is for legal advice only and does not establish an attorney-client relationship.
                        </span>
                      </label>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="font-medium text-amber-900 mb-1">Cancellation Policy</div>
                      <div className="text-sm text-amber-800">
                        You can cancel or reschedule this consultation up to 4 hours before the scheduled time for a full refund.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm & add to dashboard */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirm Booking</h2>
                  <p className="text-slate-600 mb-6">Your upcoming meeting will appear in your client dashboard.</p>

                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-vk-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-10 h-10 text-vk-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Confirm consultation</h3>
                    <p className="text-slate-600 mb-6">
                      {selectedDate} at {selectedSlot} with {lawyer.name}. Fee: ₹{lawyer.fee}.
                    </p>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={isBooking}
                      className="px-8 py-3 bg-vk-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-70"
                    >
                      {isBooking ? "Confirming..." : "Confirm & add to my meetings"}
                    </button>
                    {!isAuthenticated && (
                      <p className="mt-4 text-sm text-slate-500">You will be asked to sign in to confirm.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold ${
                      canProceed()
                        ? 'bg-vk-primary text-white hover:opacity-90'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>
              
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                <div className="w-14 h-14 bg-vk-primary/10 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  {lawyer.photo ? (
                    <img src={lawyer.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-vk-primary" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{lawyer.name}</div>
                  <div className="text-sm text-slate-600">{lawyer.expertise}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {selectedDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{selectedDate}</span>
                  </div>
                )}
                {selectedSlot && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{selectedSlot} ({lawyer.duration} min)</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Consultation Fee</span>
                  <span className="font-semibold text-slate-900">₹{lawyer.fee}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Platform Fee</span>
                  <span className="font-semibold text-slate-900">₹50</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-4 border-t border-slate-200">
                  <span>Total</span>
                  <span>₹{lawyer.fee + PLATFORM_FEE}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}