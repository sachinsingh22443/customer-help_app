import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useSettings,
  type Language,
} from "../../contexts/SettingsContext";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Moon,
  Globe2,
  ShieldCheck,
  Smartphone,
  LogOut,
  RotateCcw,
  UserRound,
  LockKeyhole,
  HelpCircle,
  FileText,
  Check,
  X,
  Languages,
  Sparkles,
} from "lucide-react";

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
}

const translations = {
  English: {
    settings: "Settings",
    managePreferences: "Manage your app preferences",
    account: "Account",
    profile: "Profile",
    profileDesc: "Manage your personal information",
    security: "Security",
    securityDesc: "Password and account security",

    preferences: "Preferences",
    notifications: "Notifications",
    notificationsDesc: "Control how EatUnity contacts you",

    push: "Push Notifications",
    pushDesc: "Receive important app notifications",

    email: "Email Notifications",
    emailDesc: "Receive updates through email",

    orderUpdates: "Order Updates",
    orderUpdatesDesc: "Status and delivery updates",

    subscriptionUpdates: "Subscription Updates",
    subscriptionUpdatesDesc: "Meal and subscription reminders",

    deliveryUpdates: "Delivery Updates",
    deliveryUpdatesDesc: "Know when your order is arriving",

    walletUpdates: "Wallet & Payment",
    walletUpdatesDesc: "Wallet credits, debits and payment updates",

    specialOffers: "Offers & Promotions",
    specialOffersDesc: "Get offers, discounts and special deals",

    appearance: "Appearance",
    appearanceDesc: "Customize how EatUnity looks",
    darkMode: "Dark Mode",
    darkModeDesc: "Use a darker appearance",

    language: "Language",
    languageDesc: "Choose your preferred language",
    english: "English",
    hindi: "हिन्दी",

    privacy: "Privacy & Security",
    privacyDesc: "Manage your privacy and security",
    dataSecure: "Your data is protected and secure",

    support: "Help & Support",
    supportDesc: "Get help with your EatUnity account",

    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    terms: "Terms & Conditions",

    appInfo: "About EatUnity",
    version: "Version",
    build: "Build",
    reset: "Reset Settings",
    logout: "Logout",

    resetTitle: "Reset all settings?",
    resetDesc: "All your preferences will be restored to their default values.",
    cancel: "Cancel",
    resetNow: "Reset",
    logoutTitle: "Logout from EatUnity?",
    logoutDesc: "You will need to login again to access your account.",

    languageTitle: "Choose Language",
    languageApplied: "Language changed successfully",
    settingsSaved: "Settings updated",
  },

  Hindi: {
    settings: "सेटिंग्स",
    managePreferences: "अपनी ऐप प्राथमिकताएं मैनेज करें",
    account: "अकाउंट",
    profile: "प्रोफाइल",
    profileDesc: "अपनी व्यक्तिगत जानकारी मैनेज करें",
    security: "सिक्योरिटी",
    securityDesc: "पासवर्ड और अकाउंट सुरक्षा",

    preferences: "प्राथमिकताएं",
    notifications: "नोटिफिकेशन",
    notificationsDesc: "तय करें EatUnity आपको कैसे संपर्क करे",

    push: "पुश नोटिफिकेशन",
    pushDesc: "जरूरी ऐप नोटिफिकेशन प्राप्त करें",

    email: "ईमेल नोटिफिकेशन",
    emailDesc: "ईमेल के माध्यम से अपडेट प्राप्त करें",

    orderUpdates: "ऑर्डर अपडेट",
    orderUpdatesDesc: "ऑर्डर स्टेटस और डिलीवरी अपडेट",

    subscriptionUpdates: "सब्सक्रिप्शन अपडेट",
    subscriptionUpdatesDesc: "मील और सब्सक्रिप्शन रिमाइंडर",

    deliveryUpdates: "डिलीवरी अपडेट",
    deliveryUpdatesDesc: "जानें आपका ऑर्डर कब आ रहा है",

    walletUpdates: "वॉलेट और पेमेंट",
    walletUpdatesDesc: "वॉलेट क्रेडिट, डेबिट और पेमेंट अपडेट",

    specialOffers: "ऑफर्स और प्रमोशन",
    specialOffersDesc: "ऑफर, डिस्काउंट और स्पेशल डील्स पाएं",

    appearance: "दिखावट",
    appearanceDesc: "EatUnity का लुक कस्टमाइज़ करें",
    darkMode: "डार्क मोड",
    darkModeDesc: "डार्क अपीयरेंस इस्तेमाल करें",

    language: "भाषा",
    languageDesc: "अपनी पसंदीदा भाषा चुनें",
    english: "English",
    hindi: "हिन्दी",

    privacy: "प्राइवेसी और सिक्योरिटी",
    privacyDesc: "अपनी प्राइवेसी और सिक्योरिटी मैनेज करें",
    dataSecure: "आपका डेटा सुरक्षित है",

    support: "मदद और सहायता",
    supportDesc: "अपने EatUnity अकाउंट की मदद पाएं",

    legal: "कानूनी जानकारी",
    privacyPolicy: "प्राइवेसी पॉलिसी",
    terms: "टर्म्स और कंडीशन्स",

    appInfo: "EatUnity के बारे में",
    version: "वर्जन",
    build: "बिल्ड",
    reset: "सेटिंग्स रीसेट करें",
    logout: "लॉगआउट",

    resetTitle: "सभी सेटिंग्स रीसेट करें?",
    resetDesc: "आपकी सभी प्राथमिकताएं डिफॉल्ट सेटिंग्स पर वापस आ जाएंगी।",
    cancel: "रद्द करें",
    resetNow: "रीसेट",
    logoutTitle: "EatUnity से लॉगआउट करें?",
    logoutDesc: "अकाउंट इस्तेमाल करने के लिए आपको दोबारा लॉगिन करना होगा।",

    languageTitle: "भाषा चुनें",
    languageApplied: "भाषा सफलतापूर्वक बदल दी गई",
    settingsSaved: "सेटिंग्स अपडेट हो गईं",
  },
};

export function Settings({ onBack, onLogout }: SettingsProps) {
  const {
    settings,
    language,
    updateSetting,
    setLanguage,
    resetSettings,
  } = useSettings();

  const [showLanguage, setShowLanguage] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [toast, setToast] = useState("");

  const t = translations[language];

  // =========================================================
  // TOAST
  // =========================================================

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2200);
  };

  // =========================================================
  // TOGGLE
  // =========================================================

  const toggleSetting = (
    key:
      | "pushNotifications"
      | "emailNotifications"
      | "orderUpdates"
      | "subscriptionUpdates"
      | "deliveryUpdates"
      | "walletUpdates"
      | "specialOffers"
      | "darkMode"
  ) => {
    updateSetting(key, !settings[key]);
    showToast(t.settingsSaved);
  };

  // =========================================================
  // LANGUAGE
  // =========================================================

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setShowLanguage(false);

    setTimeout(() => {
      setToast(
        translations[nextLanguage].languageApplied
      );
    }, 100);

    window.setTimeout(() => {
      setToast("");
    }, 2300);
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleResetSettings = () => {
    resetSettings();
    setShowReset(false);
    showToast(translations.English.settingsSaved);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setShowLogout(false);

    if (onLogout) {
      onLogout();
      return;
    }

    window.location.reload();
  };

  // =========================================================
  // SETTING ROW
  // =========================================================

  const SettingToggle = ({
    title,
    description,
    value,
    onToggle,
  }: {
    title: string;
    description: string;
    value: boolean;
    onToggle: () => void;
  }) => {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium ${
              settings.darkMode
                ? "text-white"
                : "text-[#181818]"
            }`}
          >
            {title}
          </p>

          <p
            className={`text-xs mt-1 ${
              settings.darkMode
                ? "text-white/50"
                : "text-[#181818]/50"
            }`}
          >
            {description}
          </p>
        </div>

        <div
          className={`w-[52px] h-[30px] rounded-full p-1 shrink-0 transition-colors ${
            value
              ? "bg-[#0FAD6E]"
              : settings.darkMode
              ? "bg-white/15"
              : "bg-black/10"
          }`}
        >
          <motion.div
            className="w-[22px] h-[22px] bg-white rounded-full shadow-md"
            animate={{
              x: value ? 22 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        </div>
      </button>
    );
  };

  // =========================================================
  // SECTION
  // =========================================================

  const SectionTitle = ({
    children,
  }: {
    children: ReactNode;
  }) => (
    <p
      className={`px-2 mb-2 text-xs font-bold uppercase tracking-[0.12em] ${
        settings.darkMode
          ? "text-white/45"
          : "text-[#181818]/45"
      }`}
    >
      {children}
    </p>
  );

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div
      className={`min-h-screen pb-28 transition-colors duration-300 ${
        settings.darkMode
          ? "bg-[#101312]"
          : "bg-[#FFF8F0]"
      }`}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-[#181818] via-[#252525] to-[#0FAD6E] px-5 pt-12 pb-8">
        <motion.div
          className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute -left-20 bottom-0 h-36 w-36 rounded-full bg-[#0FAD6E]/20 blur-3xl"
          animate={{
            x: [0, 15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        <div className="relative z-10">
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.92 }}
            className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <div className="mt-7 flex items-end justify-between">
            <div>
              <p className="text-white/60 text-sm">
                EatUnity
              </p>

              <h1 className="text-white text-3xl font-bold tracking-tight mt-1">
                {t.settings}
              </h1>

              <p className="text-white/60 text-sm mt-2">
                {t.managePreferences}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">

        {/* ===================================================
            ACCOUNT
        ==================================================== */}

        <section>
          <SectionTitle>{t.account}</SectionTitle>

          <div
            className={`overflow-hidden rounded-3xl border shadow-sm ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <motion.button
              whileTap={{ scale: 0.985 }}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#0FAD6E]/10 flex items-center justify-center">
                <UserRound className="w-5 h-5 text-[#0FAD6E]" />
              </div>

              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    settings.darkMode
                      ? "text-white"
                      : "text-[#181818]"
                  }`}
                >
                  {t.profile}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    settings.darkMode
                      ? "text-white/45"
                      : "text-[#181818]/45"
                  }`}
                >
                  {t.profileDesc}
                </p>
              </div>

              <ChevronRight
                className={`w-5 h-5 ${
                  settings.darkMode
                    ? "text-white/30"
                    : "text-black/25"
                }`}
              />
            </motion.button>

            <div
              className={`mx-5 border-t ${
                settings.darkMode
                  ? "border-white/5"
                  : "border-black/5"
              }`}
            />

            <motion.button
              whileTap={{ scale: 0.985 }}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <LockKeyhole className="w-5 h-5 text-purple-500" />
              </div>

              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    settings.darkMode
                      ? "text-white"
                      : "text-[#181818]"
                  }`}
                >
                  {t.security}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    settings.darkMode
                      ? "text-white/45"
                      : "text-[#181818]/45"
                  }`}
                >
                  {t.securityDesc}
                </p>
              </div>

              <ChevronRight
                className={`w-5 h-5 ${
                  settings.darkMode
                    ? "text-white/30"
                    : "text-black/25"
                }`}
              />
            </motion.button>
          </div>
        </section>

        {/* ===================================================
            NOTIFICATIONS
        ==================================================== */}

        <section>
          <SectionTitle>{t.preferences}</SectionTitle>

          <div
            className={`rounded-3xl border p-5 shadow-sm ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-500" />
              </div>

              <div>
                <p
                  className={`font-semibold ${
                    settings.darkMode
                      ? "text-white"
                      : "text-[#181818]"
                  }`}
                >
                  {t.notifications}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    settings.darkMode
                      ? "text-white/45"
                      : "text-[#181818]/45"
                  }`}
                >
                  {t.notificationsDesc}
                </p>
              </div>
            </div>

            <div
              className={`mt-3 border-t ${
                settings.darkMode
                  ? "border-white/5"
                  : "border-black/5"
              }`}
            />

            <SettingToggle
              title={t.push}
              description={t.pushDesc}
              value={settings.pushNotifications}
              onToggle={() =>
                toggleSetting("pushNotifications")
              }
            />

            <SettingToggle
              title={t.email}
              description={t.emailDesc}
              value={settings.emailNotifications}
              onToggle={() =>
                toggleSetting("emailNotifications")
              }
            />

            <SettingToggle
              title={t.orderUpdates}
              description={t.orderUpdatesDesc}
              value={settings.orderUpdates}
              onToggle={() =>
                toggleSetting("orderUpdates")
              }
            />

            <SettingToggle
              title={t.subscriptionUpdates}
              description={t.subscriptionUpdatesDesc}
              value={settings.subscriptionUpdates}
              onToggle={() =>
                toggleSetting("subscriptionUpdates")
              }
            />

            <SettingToggle
              title={t.deliveryUpdates}
              description={t.deliveryUpdatesDesc}
              value={settings.deliveryUpdates}
              onToggle={() =>
                toggleSetting("deliveryUpdates")
              }
            />

            <SettingToggle
              title={t.walletUpdates}
              description={t.walletUpdatesDesc}
              value={settings.walletUpdates}
              onToggle={() =>
                toggleSetting("walletUpdates")
              }
            />

            <SettingToggle
              title={t.specialOffers}
              description={t.specialOffersDesc}
              value={settings.specialOffers}
              onToggle={() =>
                toggleSetting("specialOffers")
              }
            />
          </div>
        </section>

        {/* ===================================================
            APPEARANCE
        ==================================================== */}

        <section>
          <SectionTitle>{t.appearance}</SectionTitle>

          <div
            className={`rounded-3xl border p-5 shadow-sm ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-500" />
              </div>

              <div>
                <p
                  className={`font-semibold ${
                    settings.darkMode
                      ? "text-white"
                      : "text-[#181818]"
                  }`}
                >
                  {t.appearance}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    settings.darkMode
                      ? "text-white/45"
                      : "text-[#181818]/45"
                  }`}
                >
                  {t.appearanceDesc}
                </p>
              </div>
            </div>

            <div
              className={`border-t pt-2 ${
                settings.darkMode
                  ? "border-white/5"
                  : "border-black/5"
              }`}
            >
              <SettingToggle
                title={t.darkMode}
                description={t.darkModeDesc}
                value={settings.darkMode}
                onToggle={() => toggleSetting("darkMode")}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            LANGUAGE
        ==================================================== */}

        <section>
          <SectionTitle>{t.language}</SectionTitle>

          <motion.button
            whileTap={{ scale: 0.985 }}
            onClick={() => setShowLanguage(true)}
            className={`w-full rounded-3xl border p-5 flex items-center gap-4 text-left shadow-sm ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#0FAD6E]/10 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-[#0FAD6E]" />
            </div>

            <div className="flex-1">
              <p
                className={`font-semibold ${
                  settings.darkMode
                    ? "text-white"
                    : "text-[#181818]"
                }`}
              >
                {t.language}
              </p>

              <p
                className={`text-xs mt-1 ${
                  settings.darkMode
                    ? "text-white/45"
                    : "text-[#181818]/45"
                }`}
              >
                {t.languageDesc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#0FAD6E]">
                {language === "English"
                  ? t.english
                  : t.hindi}
              </span>

              <ChevronRight
                className={`w-5 h-5 ${
                  settings.darkMode
                    ? "text-white/30"
                    : "text-black/25"
                }`}
              />
            </div>
          </motion.button>
        </section>

        {/* ===================================================
            PRIVACY
        ==================================================== */}

        <section>
          <SectionTitle>{t.privacy}</SectionTitle>

          <motion.button
            whileTap={{ scale: 0.985 }}
            className={`w-full rounded-3xl border p-5 flex items-center gap-4 text-left shadow-sm ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex-1">
              <p
                className={`font-semibold ${
                  settings.darkMode
                    ? "text-white"
                    : "text-[#181818]"
                }`}
              >
                {t.privacy}
              </p>

              <p
                className={`text-xs mt-1 ${
                  settings.darkMode
                    ? "text-white/45"
                    : "text-[#181818]/45"
                }`}
              >
                {t.dataSecure}
              </p>
            </div>

            <ChevronRight
              className={`w-5 h-5 ${
                settings.darkMode
                  ? "text-white/30"
                  : "text-black/25"
              }`}
            />
          </motion.button>
        </section>

        {/* ===================================================
            SUPPORT
        ==================================================== */}

        <section>
          <SectionTitle>{t.support}</SectionTitle>

          <motion.button
            whileTap={{ scale: 0.985 }}
            className={`w-full rounded-3xl border p-5 flex items-center gap-4 text-left shadow-sm ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-orange-500" />
            </div>

            <div className="flex-1">
              <p
                className={`font-semibold ${
                  settings.darkMode
                    ? "text-white"
                    : "text-[#181818]"
                }`}
              >
                {t.support}
              </p>

              <p
                className={`text-xs mt-1 ${
                  settings.darkMode
                    ? "text-white/45"
                    : "text-[#181818]/45"
                }`}
              >
                {t.supportDesc}
              </p>
            </div>

            <ChevronRight
              className={`w-5 h-5 ${
                settings.darkMode
                  ? "text-white/30"
                  : "text-black/25"
              }`}
            />
          </motion.button>
        </section>

        {/* ===================================================
            LEGAL
        ==================================================== */}

        <section>
          <SectionTitle>{t.legal}</SectionTitle>

          <div
            className={`rounded-3xl border overflow-hidden shadow-sm ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <button className="w-full flex items-center gap-4 p-5 text-left">
              <FileText className="w-5 h-5 text-[#0FAD6E]" />

              <span
                className={`flex-1 font-medium ${
                  settings.darkMode
                    ? "text-white"
                    : "text-[#181818]"
                }`}
              >
                {t.privacyPolicy}
              </span>

              <ChevronRight className="w-5 h-5 opacity-30" />
            </button>

            <div
              className={`border-t ${
                settings.darkMode
                  ? "border-white/5"
                  : "border-black/5"
              }`}
            />

            <button className="w-full flex items-center gap-4 p-5 text-left">
              <FileText className="w-5 h-5 text-purple-500" />

              <span
                className={`flex-1 font-medium ${
                  settings.darkMode
                    ? "text-white"
                    : "text-[#181818]"
                }`}
              >
                {t.terms}
              </span>

              <ChevronRight className="w-5 h-5 opacity-30" />
            </button>
          </div>
        </section>

        {/* ===================================================
            APP INFO
        ==================================================== */}

        <section>
          <div
            className={`rounded-3xl border p-5 text-center ${
              settings.darkMode
                ? "bg-[#191d1c] border-white/5"
                : "bg-white border-black/[0.04]"
            }`}
          >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#0FAD6E]/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#0FAD6E]" />
            </div>

            <p
              className={`font-semibold mt-3 ${
                settings.darkMode
                  ? "text-white"
                  : "text-[#181818]"
              }`}
            >
              {t.appInfo}
            </p>

            <p
              className={`text-xs mt-2 ${
                settings.darkMode
                  ? "text-white/40"
                  : "text-[#181818]/40"
              }`}
            >
              {t.version} 1.0.0 · {t.build} 001
            </p>

            <p
              className={`text-xs mt-1 ${
                settings.darkMode
                  ? "text-white/30"
                  : "text-[#181818]/30"
              }`}
            >
              © EatUnity
            </p>
          </div>
        </section>

        {/* ===================================================
            RESET
        ==================================================== */}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowReset(true)}
          className={`w-full rounded-2xl py-4 flex items-center justify-center gap-2 font-medium border ${
            settings.darkMode
              ? "bg-[#191d1c] border-white/5 text-white/70"
              : "bg-white border-black/5 text-[#181818]/70"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          {t.reset}
        </motion.button>

        {/* ===================================================
            LOGOUT
        ==================================================== */}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogout(true)}
          className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          {t.logout}
        </motion.button>

        <div className="h-2" />
      </div>

      {/* =====================================================
          LANGUAGE BOTTOM SHEET
      ====================================================== */}

      <AnimatePresence>
        {showLanguage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguage(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 35,
              }}
              className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-[2rem] p-6 pb-8 ${
                settings.darkMode
                  ? "bg-[#191d1c]"
                  : "bg-white"
              }`}
            >
              <div className="mx-auto w-12 h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-6" />

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0FAD6E]/10 flex items-center justify-center">
                  <Languages className="w-5 h-5 text-[#0FAD6E]" />
                </div>

                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg ${
                      settings.darkMode
                        ? "text-white"
                        : "text-[#181818]"
                    }`}
                  >
                    {t.languageTitle}
                  </h3>

                  <p
                    className={`text-xs mt-1 ${
                      settings.darkMode
                        ? "text-white/40"
                        : "text-[#181818]/40"
                    }`}
                  >
                    {t.languageDesc}
                  </p>
                </div>

                <button
                  onClick={() => setShowLanguage(false)}
                  className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {(
                  [
                    ["English", "English"],
                    ["Hindi", "हिन्दी"],
                  ] as [Language, string][]
                ).map(([value, label]) => {
                  const selected =
                    language === value;

                  return (
                    <button
                      key={value}
                      onClick={() =>
                        changeLanguage(value)
                      }
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        selected
                          ? "border-[#0FAD6E] bg-[#0FAD6E]/5"
                          : settings.darkMode
                          ? "border-white/5 bg-white/[0.03]"
                          : "border-black/5 bg-black/[0.02]"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0FAD6E]/10 flex items-center justify-center">
                        <Globe2 className="w-5 h-5 text-[#0FAD6E]" />
                      </div>

                      <span
                        className={`flex-1 text-left font-semibold ${
                          settings.darkMode
                            ? "text-white"
                            : "text-[#181818]"
                        }`}
                      >
                        {label}
                      </span>

                      {selected && (
                        <div className="w-7 h-7 rounded-full bg-[#0FAD6E] flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          RESET MODAL
      ====================================================== */}

      <AnimatePresence>
        {showReset && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className={`fixed z-50 left-5 right-5 top-1/2 -translate-y-1/2 rounded-3xl p-6 ${
                settings.darkMode
                  ? "bg-[#191d1c]"
                  : "bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-yellow-600" />
              </div>

              <h3
                className={`text-xl font-bold mt-5 ${
                  settings.darkMode
                    ? "text-white"
                    : "text-[#181818]"
                }`}
              >
                {t.resetTitle}
              </h3>

              <p
                className={`text-sm mt-2 leading-6 ${
                  settings.darkMode
                    ? "text-white/50"
                    : "text-[#181818]/50"
                }`}
              >
                {t.resetDesc}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-black/5 font-semibold"
                >
                  {t.cancel}
                </button>

                <button
                  onClick={handleResetSettings}
                  className="flex-1 py-3.5 rounded-2xl bg-[#0FAD6E] text-white font-semibold"
                >
                  {t.resetNow}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          LOGOUT MODAL
      ====================================================== */}

      <AnimatePresence>
        {showLogout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className={`fixed z-50 left-5 right-5 top-1/2 -translate-y-1/2 rounded-3xl p-6 ${
                settings.darkMode
                  ? "bg-[#191d1c]"
                  : "bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>

              <h3
                className={`text-xl font-bold mt-5 ${
                  settings.darkMode
                    ? "text-white"
                    : "text-[#181818]"
                }`}
              >
                {t.logoutTitle}
              </h3>

              <p
                className={`text-sm mt-2 leading-6 ${
                  settings.darkMode
                    ? "text-white/50"
                    : "text-[#181818]/50"
                }`}
              >
                {t.logoutDesc}
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-black/5 font-semibold"
                >
                  {t.cancel}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white font-semibold"
                >
                  {t.logout}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          TOAST
      ====================================================== */}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-5 right-5 z-[60] flex justify-center pointer-events-none"
          >
            <div className="bg-[#181818] text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-2 text-sm font-medium">
              <Check className="w-4 h-4 text-[#0FAD6E]" />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}