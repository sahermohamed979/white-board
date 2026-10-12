export interface LegalSection {
  id: string;
  title: string;
  badge?: string;
  description: string;
  points?: string[];
  importantNotice?: string;
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  lastUpdated: string;
  disclaimerBanner?: string;
  sections: LegalSection[];
}

export interface LocalizedLegalContent {
  terms: LegalDocument;
  privacy: LegalDocument;
}

export const LEGAL_CONTENT: Record<"en" | "ar", LocalizedLegalContent> = {
  en: {
    terms: {
      title: "Terms of Service",
      subtitle: "Agreement governing the use of the Sketchly whiteboard platform",
      lastUpdated: "October 2026",
      disclaimerBanner:
        "CRITICAL NOTICE: Sketchly is provided free of charge on an 'AS IS' basis. By using this service, you explicitly waive claims of liability against the creators and operators.",
      sections: [
        {
          id: "acceptance",
          title: "1. Acceptance of Terms",
          badge: "Binding Agreement",
          description:
            "By accessing, visiting, or utilizing Sketchly ('Service', 'Application', 'we', 'our', 'us'), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service and all applicable local, national, and international laws. If you do not agree with any part of these Terms, you must discontinue your use of the Service immediately.",
        },
        {
          id: "disclaimer",
          title: "2. Absolute Disclaimer of Warranties ('AS IS')",
          badge: "No Warranties",
          description:
            "THE SERVICE IS PROVIDED ON AN 'AS IS' AND 'AS AVAILABLE' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, WHETHER EXPRESS, STATUTORY, OR IMPLIED. TO THE MAXIMUM EXTENT PERMISSIBLE UNDER APPLICABLE LAW, SKETCHLY AND ITS AUTHOR (SAHER MOHAMED) EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:",
          points: [
            "Implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
            "Warranties that the service will meet your specific business, artistic, or educational requirements.",
            "Warranties regarding 100% uninterrupted uptime, continuous availability, bug-free canvas rendering, or error correction.",
            "Warranties that the service, its servers, or transmitted data are immune from cyberattacks, loss, corruption, or hardware faults.",
          ],
          importantNotice:
            "You assume complete responsibility and risk for your selection and use of the application and the results achieved through it.",
        },
        {
          id: "liability",
          title: "3. Comprehensive Limitation of Liability",
          badge: "Legal Shield",
          description:
            "TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SKETCHLY, ITS FOUNDER, CONTRIBUTORS, OPERATORS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION:",
          points: [
            "Loss of drawings, corrupted vector elements, lost brainstorming boards, or vanished work product.",
            "Loss of profits, revenue, business opportunities, goodwill, or commercial reputation.",
            "Work interruption, project delays, or device malfunction resulting from browser memory limits or canvas rendering.",
            "Unauthorized access, alteration, or interception of shared board links or realtime session streams.",
          ],
          importantNotice:
            "This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, or otherwise), even if Sketchly was advised of the possibility of such damages.",
        },
        {
          id: "ownership",
          title: "4. User Content Ownership & Intellectual Property",
          badge: "Your Work Belongs to You",
          description:
            "We believe in creator autonomy. You retain 100% full, uncompromised intellectual property ownership over all sketches, drawings, wireframes, text, shapes, and media you produce or upload to Sketchly.",
          points: [
            "Sketchly claims NO intellectual property rights, ownership, copyright, or commercial claims over your drawings.",
            "We do not claim royalty-free licenses to exploit, market, or showcase your private drawings without your consent.",
            "You are solely responsible for ensuring that content you draw or upload does not violate third-party copyrights, trademarks, or privacy rights.",
          ],
        },
        {
          id: "data-loss",
          title: "5. Local Storage & Data Loss Disclaimer",
          badge: "Local-First Persistence",
          description:
            "Sketchly is built with a local-first browser storage architecture (IndexedDB / LocalStorage) to keep your drawings rapid and private. We are not a cloud archive or disaster-recovery service.",
          points: [
            "Clearing your browser cache, utilizing incognito/private tabs, switching browsers, or device crashes can permanently delete local boards.",
            "You are strongly encouraged to routinely export your critical boards to PNG, SVG, or JSON backup files using the Export tool.",
            "Sketchly assumes no responsibility or liability for lost, erased, or unrecoverable canvas data.",
          ],
        },
        {
          id: "acceptable-use",
          title: "6. Acceptable Use & Prohibited Conduct",
          badge: "Fair Usage",
          description:
            "You agree to use Sketchly solely for lawful and legitimate purposes. You explicitly agree not to:",
          points: [
            "Upload, transmit, or share harmful payloads, malicious scripts, exploits, or malware.",
            "Attempt to overload, flood, conduct denial-of-service (DoS) attacks, or reverse-engineer our backend APIs or Supabase infrastructure.",
            "Use shared whiteboard links or realtime collaboration sessions to distribute illegal, defamatory, abusive, or infringing material.",
            "Impersonate another user, collaborator, or system administrator.",
          ],
        },
        {
          id: "changes",
          title: "7. Modifications & Termination of Service",
          badge: "Right to Update",
          description:
            "Sketchly reserves the right at its sole discretion to update, modify, suspend, or discontinue any feature, endpoint, or aspect of the application at any time without prior notice or liability. Continued use after changes indicates acceptance of the updated terms.",
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "Transparency regarding how Sketchly safeguards your data and privacy",
      lastUpdated: "October 2026",
      disclaimerBanner:
        "PRIVACY PROMISE: Sketchly is engineered as a local-first whiteboard. We do not sell your personal data, monetize your drawings, or track you across the web.",
      sections: [
        {
          id: "local-first",
          title: "1. Local-First Privacy Architecture",
          badge: "Device-First",
          description:
            "Your privacy is our core architectural decision. In standalone mode, all canvas elements, shapes, notes, and preferences are stored exclusively on your local device within your browser's IndexedDB and LocalStorage.",
          points: [
            "Your whiteboard drawings are not uploaded to our servers during ordinary sketching sessions.",
            "We cannot view, read, index, or inspect your locally saved drawings.",
            "You can erase all local data immediately at any time by clearing your browser cache or using the Clear Board tool.",
          ],
        },
        {
          id: "sharing-collaboration",
          title: "2. Transient Share Links & Realtime Sessions",
          badge: "Ephemeral Data",
          description:
            "When you actively choose to use online features, only the minimum data required to facilitate the feature is processed:",
          points: [
            "Shareable Links: When you click 'Export to link', your board snapshot is sent to our encrypted database solely so recipients with the token can view the board. These links carry a predefined expiration window.",
            "Live Collaboration: Realtime sessions broadcast cursor positions and drawing actions between participating room members via secure WebSockets. Temporary session records and snapshots are automatically deleted upon session termination.",
            "Owner Capability: Temporary HTTP-only signed cookies are used to authenticate room creators without storing personal profiles.",
          ],
        },
        {
          id: "no-sale",
          title: "3. No Sale or Commercialization of Personal Data",
          badge: "Strictly Anti-Ad",
          description:
            "We do not sell, rent, lease, trade, or monetize your personal data, canvas drawings, IP addresses, or device info to data brokers, advertising agencies, or marketing companies under any circumstances.",
        },
        {
          id: "analytics",
          title: "4. Privacy-Respecting Analytics",
          badge: "Vercel Analytics",
          description:
            "We use privacy-friendly analytics (Vercel Analytics) to measure aggregated, anonymized performance metrics such as general page load times and visitor counts.",
          points: [
            "No personally identifiable information (PII) is collected or stored.",
            "No cross-site tracking cookies or cross-platform tracking pixels are used.",
            "Data is used solely to identify bugs, optimize canvas performance, and improve reliability.",
          ],
        },
        {
          id: "cookies",
          title: "5. Cookies & Browser Storage",
          badge: "Functional Only",
          description:
            "Sketchly does not deploy third-party advertising cookies. We only utilize:",
          points: [
            "LocalStorage / IndexedDB: To preserve your board elements, dark/light theme, and language choices locally on your machine.",
            "Session Cookies: Strictly functional, short-lived HTTP-only signed cookies for temporary room creator permissions.",
          ],
        },
        {
          id: "rights",
          title: "6. Your Data Rights (GDPR / CCPA / International)",
          badge: "Full Control",
          description:
            "Because Sketchly does not maintain permanent user accounts or persistent server databases of personal files, you have immediate, autonomous control over your data:",
          points: [
            "Right to Access & Portability: You can export your drawings anytime as vector SVG, PNG, or JSON.",
            "Right to Erasure: Clear your browser storage to wipe all traces of boards from your machine instantaneously.",
            "Right to Opt-Out: Turn off sharing or collaboration at any time.",
          ],
        },
        {
          id: "contact",
          title: "7. Contact & Inquiries",
          badge: "Get in Touch",
          description:
            "If you have questions, inquiries, or legal concerns regarding these Terms or our Privacy Policy, please reach out via GitHub or email the developer at sahermohamed.dev@gmail.com.",
        },
      ],
    },
  },
  ar: {
    terms: {
      title: "شروط الخدمة والاستخدام",
      subtitle: "الاتفاقية القانونية الحاكمة لاستخدام تطبيق ومنصة سكتشلي (Sketchly)",
      lastUpdated: "أكتوبر 2026",
      disclaimerBanner:
        "إشعار قانوني هام: تطبيق سكتشلي يُقدّم مجانًا وبحالته الراهنة ('AS IS'). باستخدامك لهذا الموقع، فإنك توافق صراحة على إخلاء مسؤولية القائمين عليه ومطوريه.",
      sections: [
        {
          id: "acceptance",
          title: "1. الموافقة على الشروط",
          badge: "اتفاقية ملزمة",
          description:
            "بمجرد وصولك إلى تطبيق سكتشلي ('الخدمة'، 'التطبيق'، 'نحن')، أو تصفحه، أو استخدامه، فإنك تقر بأنك قد قرأت هذه الشروط وفهمتها ووافقت على الالتزام الكامل بها وبكافة القوانين واللوائح السارية. إذا كنت لا توافق على أي بند من هذه الشروط، يُرجى التوقف فوراً عن استخدام الخدمة.",
        },
        {
          id: "disclaimer",
          title: "2. إخلاء تام للمسؤولية عن الضمانات ('بحالته الراهنة')",
          badge: "بدون أي ضمانات",
          description:
            "تُقدّم هذه الخدمة بصيغة 'كما هي' ('AS IS') و'بحسب توافرها' ('AS AVAILABLE') دون تقديم أي ضمانات صريحة أو ضمنية أو قانونية من أي نوع. إلى أقصى حد يسمح به القانون المعمول به، يُخلي تطبيق سكتشلي ومطوره (صاهر محمد) مسؤوليته الكاملة عن:",
          points: [
            "أي ضمانات ضمنية تتعلق بالصلاحية لغرض معين، أو الجودة التجارية، أو عدم انتهاك حقوق الملكية.",
            "أي ضمان بأن الخدمة ستلبي متطلباتك الدقيقة أو التوقعات التصميمية أو التعليمية الخاصة بك.",
            "أي ضمان لعمل الخدمة بدون انقطاع، أو توفرها الدائم بنسبة 100%، أو خلوها من الأخطاء والبرمجيات غير المقصودة.",
            "أي ضمان بعدم فقدان البيانات أو سلامة خوادم الاتصال من الأعطال التقنية الفجائية.",
          ],
          importantNotice:
            "يتحمل المستخدم وحده كامل المسؤولية والمخاطر المترتبة على استخدام الخدمة والنتائج أو الرسومات الناتجة عنها.",
        },
        {
          id: "liability",
          title: "3. التحديد الشامل للمسؤولية القانونية",
          badge: "حماية قانونية تامة",
          description:
            "إلى أقصى حد تسمح به التشريعات السارية، لا يتحمل تطبيق سكتشلي ولا مطوره ولا مشغلوه ولا المساهمون فيه أي مسؤولية بأي حال من الأحوال عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية أو تأديبية، بما في ذلك على سبيل المثال لا الحصر:",
          points: [
            "فقدان أو تلف الرسومات أو عناصر المتجهات أو المخططات الفكرية أو تعذر استرجاع اللوحات.",
            "فقدان الأرباح، أو ضياع الفرص التجارية، أو توقف الأعمال والمشاريع، أو الإضرار بالسمعة التجارية.",
            "أي تعطل للأجهزة أو المتصفحات ناتج عن استهلاك ذاكرة الرسوم أو معالجة مساحات العمل الكبيرة.",
            "أي وصول غير مصرح به لروابط المشاركة المؤقتة المنشأة من قبل المستخدمين.",
          ],
          importantNotice:
            "يسري هذا التحديد للمسؤولية أياً كانت الطبيعة القانونية للدعوى (عقد، مسؤولية تقصيرية، إهمال، أو غيرها) حتى وإن تم التنبيه مسبقاً باحتمالية وقوع مثل هذه الأضرار.",
        },
        {
          id: "ownership",
          title: "4. ملكية المحتوى وحقوق الملكية الفكرية للمستخدم",
          badge: "أعمالك ملكك بالكامل",
          description:
            "نحن نؤمن بحرية وحقوق المبدعين؛ ولذلك، فإنك تحتفظ بنسبة 100% بكامل حقوق الملكية الفكرية وحقوق التأليف والنشر لكافة الرسومات، المخططات، النصوص، والأشكال التي ترسمها أو ترفعها على سكتشلي.",
          points: [
            "لا يدعي سكتشلي أي حقوق ملكية أو حقوق نشر تجارية على رسوماتك وإبداعاتك.",
            "لا يحق لنا استخدام أعمالك الخاصة أو عرضها أو تسويقها دون موافقتك الصريحة.",
            "أنت وحدك المسؤول قانونياً عن التأكد من أن المواد والصور التي ترفعها لا تنتهك حقوق الملكية الفكرية أو الخصوصية لأي طرف ثالث.",
          ],
        },
        {
          id: "data-loss",
          title: "5. التخزين المحلي وإخلاء المسؤولية عن فقدان البيانات",
          badge: "تخزين محلي مباشر",
          description:
            "يعتمد سكتشلي على بنية تخزين محلية في جهاز المستخدم والمتصفح (IndexedDB / LocalStorage) لضمان الخصوصية والسرعة. سكتشلي ليس خدمة تخزين سحابي احتياطي دائم.",
          points: [
            "مسح سجل المتصفح وبياناته (Clear Cache)، أو استخدام وضع التصفح المتخفي، أو تغيير المتصفح قد يؤدي إلى حذف اللوحات المحفوظة محلياً بشكل نهائي.",
            "ننصح المستخدمين بشدة بحفظ وتصدير اللوحات المهمة باستمرار بصيغ PNG أو SVG أو JSON من خلال خيار التصدير.",
            "لا يتحمل سكتشلي أي التزام أو تعويض عن أي لوحات محذوفة أو مفقودة أو غير قابلة للاستعادة.",
          ],
        },
        {
          id: "acceptable-use",
          title: "6. الاستخدام المقبول والمحظور",
          badge: "الاستخدام العادل",
          description:
            "أنت توافق على استخدام التطبيق للأغراض القانونية والمشروعة فقط، وتتعهد صراحة بعدم:",
          points: [
            "رفع أو نقل برمجيات خبيثة أو سكربتات ضارة أو ثغرات أمنية عبر اللوحة أو أدوات إدخال الصور.",
            "محاولة تعطيل خوادم الاتصال اللحظي أو واجهات برمجة التطبيقات (APIs) أو خوادم Supabase.",
            "استخدام غرف التعاون المباشر أو روابط المشاركة لنشر مواد محظورة أو مسيئة أو غير قانونية.",
            "انتحال صفة أي شخص آخر أو التلاعب بهوية المشاركين في الجلسات اللحظية.",
          ],
        },
        {
          id: "changes",
          title: "7. تعديل الشروط وإنهاء الخدمة",
          badge: "حق التعديل",
          description:
            "يحتفظ سكتشلي بالحق في تعديل هذه الشروط أو تحديث أي خاصية في التطبيق في أي وقت دون إشعار مسبق. يُعتبر استمرارك في استخدام التطبيق بعد نشر التعديلات موافقة صريحة عليها.",
        },
      ],
    },
    privacy: {
      title: "سياسة الخصوصية",
      subtitle: "التزامنا بالشفافية وحماية خصوصية بياناتك أثناء استخدام سكتشلي",
      lastUpdated: "أكتوبر 2026",
      disclaimerBanner:
        "عهد الخصوصية: سكتشلي مصمم ببنية محلية تحترم الخصوصية؛ لا نقوم ببيع بياناتك الشخصية أو تتبعك أو استغلال رسوماتك تجارياً.",
      sections: [
        {
          id: "local-first",
          title: "1. بنية الخصوصية أولاً (Local-First)",
          badge: "حفظ على جهازك فقط",
          description:
            "الخصوصية هي جوهر تصميمنا التقني. في الوضع العادي، يتم حفظ جميع لوحاتك، رسوماتك، عناصرك وخياراتك محلياً فقط على جهازك عبر تقنيات المتصفح الحديثة (IndexedDB و LocalStorage).",
          points: [
            "لا يتم إرسال رسوماتك أو حفظها على خوادم خارجية أثناء العمل الفردي المعتاد.",
            "لا يمكن لمطوري التطبيق أو أي طرف ثالث الاطلاع على لوحاتك المحفوظة محلياً أو فهرستها.",
            "يمكنك مسح كافة بياناتك فوراً في أي وقت من خلال مسح بيانات التخزين المؤقت في متصفحك أو استخدام زر تفريغ اللوحة.",
          ],
        },
        {
          id: "sharing-collaboration",
          title: "2. روابط المشاركة وجلسات التعاون المباشر اللحظية",
          badge: "بيانات مؤقتة",
          description:
            "عند اختيارك استخدام الميزات السحابية التعاونية عبر الإنترنت، تتم معالجة الحد الأدنى الضروري من البيانات فقط:",
          points: [
            "روابط المشاركة: عند الضغط على 'تصدير كرابط'، يتم إرسال نسخة من اللوحة مؤقتاً لتسهيل عرضها لمن يملك الرابط المشفر، وتنتهي صلاحية هذه الروابط تلقائياً.",
            "التعاون المباشر: في الغرف اللحظية، يتم بث حركات المؤشر وعمليات الرسم المشتركة بين المشاركين المتصلين فقط عبر قنوات مشفرة، وتُحذف البيانات فور إنهاء الجلسة.",
            "إثبات ملكية الجلسة: يتم استخدام كوكيز مؤقتة مشفرة (HTTP-only) للتحقق من هوية منشئ الغرفة دون طلب تسجيل بريد إلكتروني.",
          ],
        },
        {
          id: "no-sale",
          title: "3. عدم بيع أو استغلال البيانات الشخصية",
          badge: "لا إعلانات ولا تجارة بيانات",
          description:
            "نحن لا نبيع أو نؤجر أو نتاجر أو نشارك أي بيانات شخصية، أو عناوين IP، أو رسومات رقمية مع أي شركات إعلانية أو وسطاء بيانات تحت أي ظرف من الظروف.",
        },
        {
          id: "analytics",
          title: "4. تحليلات أداء تحترم الخصوصية",
          badge: "Vercel Analytics",
          description:
            "نستخدم تحليلات Vercel Analytics لمراقبة أداء الموقع وسرعة تحميل اللوحات ومعدلات الزيارات العامة مجهولة الهوية.",
          points: [
            "لا تجمع هذه التحليلات أي معلومات هوية شخصية (PII).",
            "لا يتم استخدام ملفات تتبع عبر المواقع أو إنشاء ملفات تعريفية للمستخدمين.",
            "تُستخدم هذه الإحصاءات حصراً لإصلاح الأعطال وتحسين كفاءة وسرعة لوحة الرسم.",
          ],
        },
        {
          id: "cookies",
          title: "5. ملفات تعريف الارتباط والتخزين المحلي",
          badge: "ملفات وظيفية فقط",
          description:
            "لا نستخدم أي ملفات تعريف ارتباط (Cookies) تسويقية أو إعلانية. ينحصر استخدام التخزين في:",
          points: [
            "IndexedDB و LocalStorage: لحفظ عناصر لوحاتك والسمة اللونية (الوضع الداكن/الفاتح) واللغة على جهازك.",
            "كوكيز وظيفية: كوكيز مشفرة ومؤقتة تُستخدم فقط لإدارة صلاحيات الغرف التعاونية اللحظية.",
          ],
        },
        {
          id: "rights",
          title: "6. حقوقك في بياناتك (الامتثال لمعايير GDPR / CCPA الدولية)",
          badge: "تحكم كامل للمستخدم",
          description:
            "نظراً لأن سكتشلي لا يطلب إنشاء حسابات دائمة بكلمات مرور ولا يخزن ملفاتك الشخصية على خوادمه، فإنك تتمتع بالتحكم الكامل والفوري:",
          points: [
            "حق التصدير والنقل: يمكنك تنزيل رسوماتك في أي وقت بصيغ SVG أو PNG أو JSON.",
            "حق الحذف: مسح ذاكرة المتصفح يمحو كافة آثار بياناتك فوراً من جهازك.",
            "حق إيقاف المشاركة: يمكنك إنهاء أي جلسة عمل مشتركة في أي وقت لحذف بياناتها المؤقتة فوراً.",
          ],
        },
        {
          id: "contact",
          title: "7. التواصل والاستفسارات القانونية",
          badge: "تواصل معنا",
          description:
            "إذا كانت لديك أي استفسارات أو ملاحظات قانونية تتعلق بهذه الشروط أو بسياسة الخصوصية، يمكنك التواصل معنا عبر مستودع GitHub الرسمي أو عبر البريد الإلكتروني للمطور: sahermohamed.dev@gmail.com.",
        },
      ],
    },
  },
};
