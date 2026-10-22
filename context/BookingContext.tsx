"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { ANY_BARBER_ID } from "@/lib/reservation";

import {
  type ServiceItem,
  type AddOnItem,
  SERVICES_DATA,
  SERVICE_DESCRIPTIONS,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_MAP,
  SERVICE_ADDONS_CONFIG,
} from "@/lib/bookingServices";

// Re-export services and add-ons from shared module
export {
  SERVICES_DATA,
  SERVICE_DESCRIPTIONS,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_MAP,
  SERVICE_ADDONS_CONFIG,
  type ServiceItem,
  type AddOnItem,
};

export interface BarberItem {
  id: string;
  idNumber: number;
  name: string;
  badge?: string;
  categories: ("Classic" | "Fade" | "Fashion")[];
  specialty: string;
  rating: number;
  reviewCount: number;
  photo: string;
  isAnyBarber?: boolean;
}

// Date option type
export interface DateOption {
  dayLabel: string;
  dateLabel: string;
  fullDisplay: string;
  isoDate: string;
}

export const BARBERS_DATA: BarberItem[] = [
  {
    id: "any",
    idNumber: ANY_BARBER_ID,
    name: "ใครก็ได้ (คิวเร็วที่สุด)",
    categories: ["Classic", "Fade", "Fashion"],
    specialty: "จัดสรรช่างที่พร้อมให้บริการเร็วที่สุด",
    rating: 5.0,
    reviewCount: 999,
    photo: "",
    isAnyBarber: true,
  },
  {
    id: "barber-1",
    idNumber: 1,
    name: "ช่างวีระ",
    badge: "Master Barber",
    categories: ["Classic"],
    specialty: "ทรงคลาสสิก, วินเทจ, โกนหนวดประคบอุ่น",
    rating: 5.0,
    reviewCount: 248,
    photo: "/images/barber-veera.jpg",
  },
  {
    id: "barber-2",
    idNumber: 2,
    name: "ช่างเบค",
    badge: "Fade Specialist",
    categories: ["Fade"],
    specialty: "สกินเฟด, อันเดอร์คัต, สตรีทโมเดิร์น",
    rating: 4.9,
    reviewCount: 185,
    photo: "/images/barber-beck.jpg",
  },
  {
    id: "barber-3",
    idNumber: 3,
    name: "ช่างฟลุ๊ค",
    badge: "Stylist",
    categories: ["Fashion", "Fade"],
    specialty: "ทรงเกาหลี, แฟชั่น, คอมม่า, มัลเล็ต",
    rating: 4.8,
    reviewCount: 142,
    photo: "/images/barber-fluke.jpg",
  },
];

export const TIME_SLOTS: string[] = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

export function generateDateOptions(): DateOption[] {
  const options: DateOption[] = [];
  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสฯ", "ศุกร์", "เสาร์"];

  const baseDate = new Date();

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${date}`;

    const dayName = thaiDays[d.getDay()];
    const monthName = thaiMonths[d.getMonth()];
    const dateNum = d.getDate();

    let dayLabel = `${dateNum} ${monthName}`;
    if (i === 0) dayLabel = "วันนี้";
    else if (i === 1) dayLabel = "พรุ่งนี้";

    const dateLabel = `${dateNum} ${monthName}`;
    const fullDisplay = `${dayName}ที่ ${dateNum} ${monthName} ${year + 543}`;

    options.push({
      dayLabel,
      dateLabel,
      fullDisplay,
      isoDate,
    });
  }
  return options;
}



interface BookingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  // Step 1: Service (Single-select) & Add-ons
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  selectedService: ServiceItem | null;
  selectService: (service: ServiceItem) => void;
  clearService: () => void;
  serviceAlert: string | null;
  clearServiceAlert: () => void;
  selectedAddOns: AddOnItem[];
  toggleAddOn: (addOn: AddOnItem) => void;
  removeAddOn: (addOnId: string) => void;
  clearAddOns: () => void;
  // Step 2: Barber
  barberCategory: "All" | "Classic" | "Fade" | "Fashion";
  setBarberCategory: (cat: "All" | "Classic" | "Fade" | "Fashion") => void;
  selectedBarber: BarberItem;
  setSelectedBarber: (barber: BarberItem) => void;
  // Step 3: Date & Time
  dateOptions: DateOption[];
  selectedDateIndex: number;
  setSelectedDateIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedDate: DateOption;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  bookedSlots: string[];
  // Step 4: Customer Details
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerNotes: string;
  setCustomerNotes: (notes: string) => void;
  formErrors: { name?: string; phone?: string };
  setFormErrors: React.Dispatch<React.SetStateAction<{ name?: string; phone?: string }>>;
  validateStep4: () => boolean;
  // Step 5: Submission & Code
  isSubmitting: boolean;
  bookingCode: string;
  setBookingCode: (code: string) => void;
  confirmBooking: () => Promise<void>;
  // Navigation & Reset
  goToStep: (step: number) => void;
  handleNext: () => void;
  handleBack: () => void;
  resetBooking: () => void;
  // Price & Duration
  totalPrice: number;
  totalDuration: number;
  // Validation status & Messaging
  canProceed: boolean;
  missingRequirementText: string;
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = "veera_booking_state_v2";

export function BookingProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const dateOptions = useMemo(() => generateDateOptions(), []);

  // Hydration guard
  const [isHydrated, setIsHydrated] = useState(false);

  // Flow State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("ทั้งหมด");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(SERVICES_DATA[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnItem[]>([]);
  const [serviceAlert, setServiceAlert] = useState<string | null>(null);

  const [barberCategory, setBarberCategory] = useState<"All" | "Classic" | "Fade" | "Fashion">("All");
  const [selectedBarber, setSelectedBarberState] = useState<BarberItem>(BARBERS_DATA[0]);

  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingCode, setBookingCode] = useState<string>("");

  const selectedDate = useMemo(
    () => dateOptions[selectedDateIndex] || dateOptions[0],
    [dateOptions, selectedDateIndex]
  );

  const totalPrice = useMemo(() => {
    const base = selectedService ? selectedService.price : 0;
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return base + addOnsTotal;
  }, [selectedService, selectedAddOns]);

  const totalDuration = useMemo(() => {
    const base = selectedService ? selectedService.duration : 0;
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.durationMin, 0);
    return base + addOnsTotal;
  }, [selectedService, selectedAddOns]);

  // Compute canProceed per step
  const canProceed = useMemo(() => {
    if (currentStep === 1) return Boolean(selectedService);
    if (currentStep === 2) return Boolean(selectedBarber);
    if (currentStep === 3) return Boolean(selectedTime);
    if (currentStep === 4) {
      const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
      return customerName.trim().length > 0 && cleanPhone.length >= 9;
    }
    if (currentStep === 5) {
      const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
      return Boolean(
        selectedService &&
        selectedBarber &&
        selectedDate &&
        selectedTime &&
        customerName.trim().length > 0 &&
        cleanPhone.length >= 9 &&
        !isSubmitting
      );
    }
    return true;
  }, [
    currentStep,
    selectedService,
    selectedBarber,
    selectedTime,
    selectedDate,
    customerName,
    customerPhone,
    isSubmitting,
  ]);

  // Compute missing requirement text for disabled helper label
  const missingRequirementText = useMemo(() => {
    if (currentStep === 1 && !selectedService) return "เลือกบริการเพื่อดำเนินการต่อ";
    if (currentStep === 2 && !selectedBarber) return "เลือกช่างเพื่อดำเนินการต่อ";
    if (currentStep === 3 && !selectedTime) return "เลือกเวลาเพื่อดำเนินการต่อ";
    if (currentStep === 4) {
      const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
      if (!customerName.trim() && cleanPhone.length < 9)
        return "กรอกชื่อและเบอร์โทรศัพท์เพื่อดำเนินการต่อ";
      if (!customerName.trim()) return "กรอกชื่อ - นามสกุลเพื่อดำเนินการต่อ";
      if (cleanPhone.length < 9) return "กรอกเบอร์โทรศัพท์ที่ถูกต้องเพื่อดำเนินการต่อ";
    }
    if (currentStep === 5 && !canProceed) return "ข้อมูลการจองยังไม่ครบถ้วน";
    return "";
  }, [currentStep, selectedService, selectedBarber, selectedTime, customerName, customerPhone, canProceed]);

  // Load from sessionStorage on client mount (SSR Safe)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Promise.resolve().then(() => {
          if (parsed.currentStep && parsed.currentStep >= 1 && parsed.currentStep <= 6) {
            setCurrentStep(parsed.currentStep);
          }
          if (parsed.selectedServiceId) {
            const foundSrv = SERVICES_DATA.find((s) => s.id === parsed.selectedServiceId);
            if (foundSrv) setSelectedService(foundSrv);
            else if (parsed.selectedServiceId === null) setSelectedService(null);

            // Restore add-ons if primary service matches
            if (Array.isArray(parsed.selectedAddOnIds)) {
              const available = SERVICE_ADDONS_CONFIG[parsed.selectedServiceId] || [];
              const restored = available.filter((a) =>
                parsed.selectedAddOnIds.includes(a.id)
              );
              setSelectedAddOns(restored);
            }
          }
          let barberFound = false;
          if (parsed.selectedBarberId) {
            const foundBarber = BARBERS_DATA.find((b) => b.id === parsed.selectedBarberId);
            if (foundBarber) {
              setSelectedBarberState(foundBarber);
              barberFound = true;
            }
          }
          if (parsed.currentStep && parsed.currentStep > 2 && !barberFound) {
            setCurrentStep(2);
            setSelectedBarberState(BARBERS_DATA[0]);
            setServiceAlert("กรุณาเลือกช่างตัดผมเพื่อดำเนินการต่อ");
          }
          if (typeof parsed.selectedDateIndex === "number") {
            setSelectedDateIndex(Math.min(parsed.selectedDateIndex, dateOptions.length - 1));
          }
          if (parsed.selectedTime) {
            setSelectedTime(parsed.selectedTime);
          }
          if (parsed.customerName) setCustomerName(parsed.customerName);
          if (parsed.customerPhone) setCustomerPhone(parsed.customerPhone);
          if (parsed.customerNotes) setCustomerNotes(parsed.customerNotes);
          if (parsed.bookingCode) setBookingCode(parsed.bookingCode);
          setIsHydrated(true);
        });
        return;
      }
    } catch {
      // sessionStorage unavailable or blocked
    }
    Promise.resolve().then(() => {
      setIsHydrated(true);
    });
  }, [dateOptions.length]);

  // Persist to sessionStorage on state updates
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const dataToSave = {
        currentStep,
        selectedServiceId: selectedService ? selectedService.id : null,
        selectedAddOnIds: selectedAddOns.map((a) => a.id),
        selectedBarberId: selectedBarber ? selectedBarber.id : "any",
        selectedDateIndex,
        selectedTime,
        customerName,
        customerPhone,
        customerNotes,
        bookingCode,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // Ignore quota errors
    }
  }, [
    isHydrated,
    currentStep,
    selectedService,
    selectedAddOns,
    selectedBarber,
    selectedDateIndex,
    selectedTime,
    customerName,
    customerPhone,
    customerNotes,
    bookingCode,
  ]);

  // Check URL query parameters (?service=... or ?barber=...)
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const barberParam = searchParams.get("barber");

    if (serviceParam || barberParam) {
      Promise.resolve().then(() => {
        if (serviceParam) {
          const foundSrv = SERVICES_DATA.find((s) => s.id === serviceParam);
          if (foundSrv) setSelectedService(foundSrv);
        }
        if (barberParam) {
          const barberNum = parseInt(barberParam, 10);
          const foundBarber = BARBERS_DATA.find((b) => b.idNumber === barberNum);
          if (foundBarber) setSelectedBarberState(foundBarber);
        }
      });
    }
  }, [searchParams]);

  // Fetch or mock occupied time slots
  useEffect(() => {
    if (selectedDate.isoDate && selectedBarber.idNumber !== undefined) {
      const fetchOccupiedSlots = async () => {
        try {
          const res = await fetch(
            `/api/available-slots?date=${selectedDate.isoDate}&barberId=${selectedBarber.idNumber}`
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.bookedSlots)) {
              setBookedSlots(data.bookedSlots);
              return;
            }
          }
        } catch {
          // Fallback
        }

        const charCode =
          (selectedDate.isoDate.charCodeAt(9) || 0) + selectedBarber.idNumber;
        const mockSlot1 = TIME_SLOTS[charCode % TIME_SLOTS.length];
        const mockSlot2 = TIME_SLOTS[(charCode + 4) % TIME_SLOTS.length];
        setBookedSlots([mockSlot1, mockSlot2]);
      };

      fetchOccupiedSlots();
    }
  }, [selectedDate, selectedBarber]);

  // Single-select service handler
  const selectService = useCallback(
    (srv: ServiceItem) => {
      // If already selected, maintain selection (do not toggle off)
      if (selectedService?.id === srv.id) {
        return;
      }

      // Automatically reset add-ons when switching to a different primary service
      setSelectedAddOns([]);

      // If user had previously selected a time slot in step 3, check compatibility
      if (selectedTime && bookedSlots.includes(selectedTime)) {
        setSelectedTime("");
        setServiceAlert(`คุณเปลี่ยนเป็น "${srv.name}" กรุณาเลือกช่วงเวลาใหม่อีกครั้ง`);
      } else if (selectedService && selectedService.duration !== srv.duration && selectedTime) {
        setServiceAlert(`เปลี่ยนเป็น "${srv.name}" (${srv.duration} นาที) แล้ว`);
      } else {
        setServiceAlert(null);
      }

      setSelectedService(srv);
    },
    [selectedService, selectedTime, bookedSlots]
  );

  const clearService = useCallback(() => {
    setSelectedService(null);
    setSelectedAddOns([]);
  }, []);

  const clearServiceAlert = useCallback(() => {
    setServiceAlert(null);
  }, []);

  const toggleAddOn = useCallback(
    (addOn: AddOnItem) => {
      setSelectedAddOns((prev) => {
        const isSelected = prev.some((a) => a.id === addOn.id);
        const updated = isSelected
          ? prev.filter((a) => a.id !== addOn.id)
          : [...prev, addOn];

        // If time was already selected in Step 3, inform the user about the new total duration
        if (selectedTime && selectedService) {
          const newDuration =
            selectedService.duration +
            updated.reduce((sum, a) => sum + a.durationMin, 0);
          setServiceAlert(
            isSelected
              ? `นำบริการ "${addOn.nameTh}" ออกแล้ว (ระยะเวลารวม ${newDuration} นาที)`
              : `เพิ่มบริการ "${addOn.nameTh}" (+${addOn.price} ฿ · ระยะเวลารวม ${newDuration} นาที) กรุณาตรวจสอบเวลาที่เลือก`
          );
        }

        return updated;
      });
    },
    [selectedTime, selectedService]
  );

  const removeAddOn = useCallback(
    (addOnId: string) => {
      setSelectedAddOns((prev) => {
        const removed = prev.find((a) => a.id === addOnId);
        const updated = prev.filter((a) => a.id !== addOnId);
        if (selectedTime && selectedService) {
          const newDuration =
            selectedService.duration +
            updated.reduce((sum, a) => sum + a.durationMin, 0);
          setServiceAlert(
            `นำบริการ "${removed?.nameTh || "บริการเสริม"}" ออกแล้ว (ระยะเวลารวม ${newDuration} นาที)`
          );
        }
        return updated;
      });
    },
    [selectedTime, selectedService]
  );

  const clearAddOns = useCallback(() => {
    setSelectedAddOns([]);
  }, []);

  const setSelectedBarber = useCallback((barber: BarberItem) => {
    setSelectedBarberState(barber);
  }, []);

  // Step 4 Form validation
  const validateStep4 = useCallback((): boolean => {
    const errors: { name?: string; phone?: string } = {};
    if (!customerName.trim()) {
      errors.name = "กรุณากรอกชื่อ - นามสกุล";
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      errors.phone = "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9-10 หลัก)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [customerName, customerPhone]);

  // Navigation handlers

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= 5) {
        setSubmitError(null);
        setCurrentStep(step);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      if (!selectedService) return;
    }
    if (currentStep === 2) {
      if (!selectedBarber) return;
    }
    if (currentStep === 3) {
      if (!selectedTime) return;
    }
    if (currentStep === 4) {
      if (!validateStep4()) return;
    }
    if (currentStep < 6) {
      setSubmitError(null);
      setCurrentStep((prev) => prev + 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentStep, selectedService, selectedBarber, selectedTime, validateStep4]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setSubmitError(null);
      setCurrentStep((prev) => prev - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentStep]);

  // Confirm booking in Step 5
  const confirmBooking = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const datePart = selectedDate.isoDate.replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedCode = `VB${datePart}-${randomSuffix}`;
    setBookingCode(generatedCode);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.replace(/[^0-9]/g, ""),
          barberId: selectedBarber?.idNumber ?? ANY_BARBER_ID,
          serviceId: selectedService?.id || "haircut-adult",
          hairstyleId: selectedService?.id || "haircut-adult",
          date: selectedDate.isoDate,
          startTime: selectedTime,
          addOns: selectedAddOns.map((a) => a.id),
          addOnIds: selectedAddOns.map((a) => a.id),
          totalPrice,
          totalDuration,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.error && !data.error.includes("MongoDB")) {
          setSubmitError(data.error);
          setIsSubmitting(false);
          return;
        }
      }

      setCurrentStep(6);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      // Continue to Step 6 even if mock DB
      setCurrentStep(6);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    selectedDate,
    selectedBarber,
    selectedService,
    selectedAddOns,
    selectedTime,
    customerName,
    customerPhone,
    totalPrice,
    totalDuration,
  ]);

  // Reset booking to start fresh
  const resetBooking = useCallback(() => {
    setSelectedService(SERVICES_DATA[0]);
    setSelectedAddOns([]);
    setSelectedBarberState(BARBERS_DATA[0]);
    setSelectedDateIndex(0);
    setSelectedTime("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerNotes("");
    setFormErrors({});
    setBookingCode("");
    setSubmitError(null);
    setCurrentStep(1);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const value = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      activeCategory,
      setActiveCategory,
      selectedService,
      selectService,
      clearService,
      serviceAlert,
      clearServiceAlert,
      selectedAddOns,
      toggleAddOn,
      removeAddOn,
      clearAddOns,
      barberCategory,
      setBarberCategory,
      selectedBarber,
      setSelectedBarber,
      dateOptions,
      selectedDateIndex,
      setSelectedDateIndex,
      selectedDate,
      selectedTime,
      setSelectedTime,
      bookedSlots,
      customerName,
      setCustomerName,
      customerPhone,
      setCustomerPhone,
      customerNotes,
      setCustomerNotes,
      formErrors,
      setFormErrors,
      validateStep4,
      isSubmitting,
      bookingCode,
      setBookingCode,
      confirmBooking,
      goToStep,
      handleNext,
      handleBack,
      resetBooking,
      totalPrice,
      totalDuration,
      canProceed,
      missingRequirementText,
      submitError,
      setSubmitError,
    }),
    [
      currentStep,
      activeCategory,
      selectedService,
      selectService,
      clearService,
      serviceAlert,
      clearServiceAlert,
      selectedAddOns,
      toggleAddOn,
      removeAddOn,
      clearAddOns,
      barberCategory,
      selectedBarber,
      setSelectedBarber,
      dateOptions,
      selectedDateIndex,
      selectedDate,
      selectedTime,
      bookedSlots,
      customerName,
      customerPhone,
      customerNotes,
      formErrors,
      validateStep4,
      isSubmitting,
      bookingCode,
      confirmBooking,
      goToStep,
      handleNext,
      handleBack,
      resetBooking,
      totalPrice,
      totalDuration,
      canProceed,
      missingRequirementText,
      submitError,
    ]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
