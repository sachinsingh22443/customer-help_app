import { motion } from "motion/react";
import {
  ChevronLeft,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { useEffect, useState } from "react";

interface HelpSupportProps {
  onBack: () => void;
}

export function HelpSupport({ onBack }: HelpSupportProps) {

  const [language, setLanguage] = useState("English");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  // 🔥 load language
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setLanguage(parsed.language || "English");
    }
  }, []);

  // 🌍 translations
  const t = {
    English: {
      title: "Help & Support",
      contact: "Get in Touch",
      faq: "Browse FAQs",
      legal: "Legal & Policies",
      articles: "articles",
    },
    Hindi: {
      title: "मदद और सहायता",
      contact: "संपर्क करें",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      legal: "कानूनी और नीतियां",
      articles: "लेख",
    }
  }[language];

  // ================= CONTACT =================
  const handleCall = () => window.location.href = "tel:+9118001234567";
  const handleEmail = () => window.location.href = "mailto:support@eatunity.com";
  const handleChat = () => alert("Live chat coming soon 🚀");

  const contactMethods = [
    { icon: MessageCircle, title: "Live Chat", subtitle: "2 min response", action: handleChat },
    { icon: Phone, title: "Call Us", subtitle: "+91 7014929514", action: handleCall },
    { icon: Mail, title: "Email", subtitle: "support@eatunity.com", action: handleEmail },
  ];

  // ================= FAQ DATA =================
  const faqData: any = {
    "Orders & Delivery": [
      { q: "How to track order?", a: "Go to Orders section." },
      { q: "Order late?", a: "You will get notification." },
    ],
    "Subscriptions": [
      { q: "Cancel subscription?", a: "Go to subscriptions page." },
    ],
    "Payments & Refunds": [
      { q: "Refund time?", a: "5-7 working days." },
    ],
    "Account & Profile": [
      { q: "Edit profile?", a: "Go to profile edit." },
    ],
  };

  // ================= LEGAL =================
  const handleLegalClick = (type: string) => {
    const routes: any = {
      terms: "/legal/terms",
      privacy: "/legal/privacy",
      refund: "/legal/refund",
      safety: "/legal/safety",
    };
    window.location.href = routes[type];
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0FAD6E] via-[#FF7A30] to-[#5F2EEA] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ChevronLeft className="text-white" />
          </button>
          <h1 className="text-white flex-1">{t.title}</h1>
        </div>
      </div>

      {/* CONTACT */}
      <div className="px-6 mt-6">
        <h3 className="mb-4">{t.contact}</h3>

        {contactMethods.map((m, i) => {
          const Icon = m.icon;
          return (
            <button key={i} onClick={m.action} className="w-full bg-white p-4 rounded-2xl mb-3 flex items-center gap-4">
              <Icon />
              <div className="flex-1 text-left">
                <p>{m.title}</p>
                <p className="text-sm text-gray-500">{m.subtitle}</p>
              </div>
              <ChevronRight />
            </button>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="px-6 mt-6">
        <h3 className="mb-4">{t.faq}</h3>

        {Object.keys(faqData).map((cat) => (
          <div key={cat} className="mb-3">

            <button
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="w-full bg-white p-4 rounded-2xl flex justify-between"
            >
              <span>{cat}</span>
              {activeCategory === cat ? <ChevronDown /> : <ChevronRight />}
            </button>

            {activeCategory === cat && (
              <div className="mt-2 space-y-2">

                {faqData[cat].map((faq: any, i: number) => {
                  const key = cat + i;

                  return (
                    <div key={i} className="bg-white p-3 rounded-xl border">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === key ? null : key)}
                        className="w-full flex justify-between"
                      >
                        <span>{faq.q}</span>
                        {openFAQ === key ? <ChevronDown /> : <ChevronRight />}
                      </button>

                      {openFAQ === key && (
                        <p className="text-sm text-gray-500 mt-2">{faq.a}</p>
                      )}
                    </div>
                  );
                })}

              </div>
            )}
          </div>
        ))}
      </div>

      {/* LEGAL */}
      <div className="px-6 mt-6">
        <div className="bg-white p-6 rounded-2xl">
          <h3 className="mb-3">{t.legal}</h3>

          <button onClick={() => handleLegalClick("terms")} className="block w-full text-left py-2">Terms & Conditions</button>
          <button onClick={() => handleLegalClick("privacy")} className="block w-full text-left py-2">Privacy Policy</button>
          <button onClick={() => handleLegalClick("refund")} className="block w-full text-left py-2">Refund & Cancellation</button>
          <button onClick={() => handleLegalClick("safety")} className="block w-full text-left py-2">Food Safety Guidelines</button>

        </div>
      </div>

    </div>
  );
}