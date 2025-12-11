"use client";
import React, { useState } from 'react';
import { Calendar, Clock, FileText, CreditCard, CheckCircle, Upload, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [description, setDescription] = useState<any>('');
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [agreed, setAgreed] = useState(false);

  const steps = [
    { number: 1, title: 'Date & Time', icon: Calendar },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Review', icon: CheckCircle },
    { number: 4, title: 'Payment', icon: CreditCard }
  ];

  const lawyer = {
    name: "Adv. Rajesh Kumar",
    photo: "👨‍⚖️",
    expertise: "Corporate & Property Law",
    fee: 1500,
    duration: 30
  };

  const dates = [
    { date: '2024-12-04', day: 'Today', available: true },
    { date: '2024-12-05', day: 'Tomorrow', available: true },
    { date: '2024-12-06', day: 'Dec 6', available: true },
    { date: '2024-12-07', day: 'Dec 7', available: false },
    { date: '2024-12-08', day: 'Dec 8', available: true }
  ];

  const timeSlots = {
    morning: ['09:00 AM', '10:00 AM', '11:00 AM'],
    afternoon: ['02:00 PM', '03:00 PM', '04:00 PM'],
    evening: ['05:00 PM', '06:00 PM']
  };

  const handleFileUpload = (e:any) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index:any) => {
    setUploadedFiles(uploadedFiles.filter((_:any, i:any) => i !== index));
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedDate && selectedSlot;
    if (currentStep === 2) return description.trim().length > 0;
    if (currentStep === 3) return agreed;
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-900">Vakeel Kutami</div>
            <button className="text-slate-600 hover:text-slate-900">Cancel Booking</button>
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
                className="h-full bg-blue-900 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-blue-900 text-white'
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
                    <div className="grid grid-cols-5 gap-3">
                      {dates.map((d) => (
                        <button
                          key={d.date}
                          disabled={!d.available}
                          onClick={() => setSelectedDate(d.date)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            !d.available
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : selectedDate === d.date
                              ? 'border-blue-900 bg-blue-50 text-blue-900'
                              : 'border-slate-300 hover:border-blue-900 hover:bg-blue-50'
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
                      
                      <div className="space-y-4">
                        {Object.entries(timeSlots).map(([period, slots]) => (
                          <div key={period}>
                            <div className="text-sm font-medium text-slate-600 mb-2 capitalize">{period}</div>
                            <div className="grid grid-cols-4 gap-3">
                              {slots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                                    selectedSlot === slot
                                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                                      : 'border-slate-300 hover:border-blue-900 hover:bg-blue-50'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-900 hover:bg-blue-50 transition-colors cursor-pointer">
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
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-900" />
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-5 h-5 text-blue-900 rounded mt-0.5"
                        />
                        <span className="text-sm text-slate-700">
                          I agree to the <a href="#" className="text-blue-900 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-900 hover:underline">Privacy Policy</a>. I understand that this consultation is for legal advice only and does not establish an attorney-client relationship.
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

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment</h2>
                  <p className="text-slate-600 mb-6">Complete your booking with secure payment</p>

                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-10 h-10 text-blue-900" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Redirecting to Payment Gateway</h3>
                    <p className="text-slate-600 mb-6">You'll be redirected to Razorpay to complete the payment securely</p>
                    <button className="px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold">
                      Proceed to Payment
                    </button>
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
                        ? 'bg-blue-900 text-white hover:bg-blue-800'
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
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-2xl">
                  {lawyer.photo}
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
                  <span>₹{lawyer.fee + 50}</span>
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