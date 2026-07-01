# LumoChat — راهنمای انتشار روی اندروید (Play Store)

این پروژه یک اپ وب (HTML/CSS/JS) هست که با **Capacitor** به یک اپ بومی اندروید تبدیل می‌شه. ورود کاربر با **Firebase Phone Authentication** واقعیه (پیامک واقعی)، و داده‌های مشترک (چت، بازی‌ها، پروفایل‌ها) روی **Firebase Firestore** ذخیره می‌شن تا بین گوشی‌های مختلف sync بشن.

آیکون و اسپلش‌اسکرین اپ هم از قبل توی پوشه‌ی `resources/` آماده‌ست (با همون گرادیان آبی/بنفش/صورتی برند LumoChat).

---

## مرحله ۱ — ساخت پروژه Firebase

1. برو به [console.firebase.google.com](https://console.firebase.google.com) و یک پروژه جدید بساز.
2. **Build → Firestore Database** → یک دیتابیس بساز (نزدیک‌ترین ریجن به کاربرهات).
3. توی تب **Rules** محتوای فایل `firestore.rules` همین پروژه رو پیست کن و Publish بزن (توضیح محدودیت امنیتی‌ش پایین همین فایل هست).
4. **Build → Authentication → Sign-in method** → گزینه **Phone** رو فعال (Enable) کن.
5. توی پروژه Firebase، **Project settings** → پایین صفحه، بخش **Your apps** → آیکون `</>` (Web) → یک اپ وب ثبت کن؛ یک `firebaseConfig` بهت می‌ده.
6. فایل `www/index.html` رو باز کن، دنبال `FIREBASE_CONFIG` بگرد (نزدیک بالای تگ اصلی `<script>`) و مقادیرش رو با مقادیر واقعی جایگزین کن.
7. توی **Authentication → Settings → Authorized domains**، دامنه‌ی `localhost` معمولاً از قبل هست؛ لازم نیست برای اپ اندرویدی دامنه جدیدی اضافه کنی چون reCAPTCHA داخل WebView کار می‌کنه.

### ⚠️ نکته‌ی مهم درباره‌ی SMS واقعی
- Firebase Phone Auth روی پلن رایگان (Spark) محدودیت داره و برای استفاده‌ی واقعی (غیر از چند شماره تستی که خودت توی Console تعریف می‌کنی) نیاز به ارتقا به پلن **Blaze** (Pay-as-you-go) داره.
- برای تست بدون هزینه‌ی پیامک واقعی، توی **Authentication → Sign-in method → Phone → Phone numbers for testing** می‌تونی چند شماره‌ی فیک با کد ثابت تعریف کنی.
- پشتیبانی از شماره‌های ایران (+98) رو حتماً قبل از انتشار نهایی، با یه تست واقعی روی شماره‌ی خودت چک کن — بعضی سرویس‌های گوگل بسته به منطقه محدودیت دارن.

---

## مرحله ۲ — قوانین امنیتی Firestore (توضیح)

فایل `firestore.rules` فعلاً باز گذاشته شده (`allow read, write: if true`) چون احراز هویت واقعی تازه اضافه شده و منطق برنامه هنوز چک نمی‌کنه که «این کاربر واقعاً صاحب این پیام/پروفایل هست یا نه». این یعنی هر کسی که اپ رو نصب کرده باشه (یا فقط `FIREBASE_CONFIG` رو از داخل APK استخراج کنه) می‌تونه همه‌ی داده‌های Firestore رو بخونه/بنویسه.

برای یه انتشار عمومی جدی، قدم بعدی اینه که:
- قوانین رو طوری محکم کنیم که هر کاربر فقط با `request.auth.token.phone_number` خودش بتونه پروفایل خودش رو بنویسه.
- برای پیام‌ها، حداقل چک کنیم که `request.auth != null` باشه (یعنی کاربر واقعاً لاگین کرده).

اگه بخوای همین الان این قسمت رو هم محکم کنم، بگو.

---

## مرحله ۳ — نصب ابزارها (یک‌بار، روی سیستم خودت)

- [Node.js](https://nodejs.org) (نسخه LTS)
- [Android Studio](https://developer.android.com/studio) (شامل Android SDK)
- حساب [Google Play Console](https://play.google.com/console) (هزینه ثبت‌نام یک‌بار ۲۵ دلاره)

---

## مرحله ۴ — تبدیل به پروژه اندروید با Capacitor

```bash
npm install
npx cap add android
npx cap sync android
```

> `appId` توی `capacitor.config.json` الان `com.lumochat.app` هست. این باید یکتا باشه و بعد از اولین انتشار قابل تغییر نیست — اگه اسم دیگه‌ای می‌خوای، همین الان قبل از `cap add android` عوضش کن.

---

## مرحله ۵ — تولید آیکون و اسپلش‌اسکرین برای همه‌ی سایزها

فایل‌های خام (۱۰۲۴×۱۰۲۴ برای آیکون، ۲۷۳۲×۲۷۳۲ برای اسپلش) از قبل توی `resources/` هست:
- `icon.png` — آیکون ساده (fallback برای اندرویدهای قدیمی)
- `icon-foreground.png` / `icon-background.png` — لایه‌های آیکون Adaptive (اندروید ۸+)
- `splash.png` / `splash-dark.png` — اسپلش‌اسکرین

برای ساخت خودکار همه‌ی سایزهای لازم:

```bash
npm install @capacitor/splash-screen
npx @capacitor/assets generate --android
npx cap sync android
```

اگه خواستی طرح آیکون یا اسپلش عوض بشه (رنگ، لوگو، متن)، بگو تا دوباره بسازمش — فایل‌های مبدأ پایتونی که این تصاویر رو ساختن رو هم دارم و راحت قابل تغییرن.

---

## مرحله ۶ — اجرا و تست

```bash
npx cap open android
```

از Android Studio، با یک Emulator یا گوشی واقعی (USB Debugging فعال)، دکمه **Run ▶** رو بزن.

---

## مرحله ۷ — ساخت نسخه‌ی نهایی امضاشده (Signed AAB)

1. Android Studio → **Build → Generate Signed Bundle / APK**
2. **Android App Bundle (AAB)** رو انتخاب کن (فرمت الزامی Play Store).
3. یک **Keystore** جدید بساز (یا از قبلی استفاده کن) — این فایل رو جایی امن نگه دار؛ برای آپدیت‌های بعدی لازمه و غیرقابل جایگزینیه.
4. Build کن؛ فایل `app-release.aab` ساخته می‌شه.

---

## مرحله ۸ — انتشار در Google Play Console

1. [Play Console](https://play.google.com/console) → **Create app**.
2. اطلاعات پایه (اسم، دسته‌بندی، رایگان/پولی) رو پر کن.
3. **Store listing**: توضیحات، آیکون ۵۱۲×۵۱۲ (از `resources/icon.png` می‌تونی export بگیری)، اسکرین‌شات‌ها، گرافیک فیچر.
4. **Policy**: Privacy Policy (چون اپ چت داره و شماره تلفن/پیام کاربر ذخیره می‌کنه، لینک الزامیه)، Data safety form، Content rating.
5. **Production → Create new release** → آپلود `app-release.aab`.
6. Review و Submit — معمولاً چند ساعت تا چند روز طول می‌کشه، مخصوصاً بار اول.

---

## خلاصه‌ی فایل‌های پروژه

```
lumochat-android/
├── www/index.html          کل اپ (UI + منطق + Firebase Auth/Firestore)
├── capacitor.config.json   تنظیمات بسته‌بندی اندروید
├── package.json            وابستگی‌های Capacitor + ابزار تولید آیکون
├── firestore.rules         قوانین امنیتی Firestore (فعلاً باز — بالا توضیح داده شد)
└── resources/               فایل‌های خام آیکون و اسپلش‌اسکرین
```

## قدم‌های بعدی پیشنهادی

- محکم کردن قوانین Firestore بر اساس `request.auth` واقعی (بالا توضیح داده شد).
- نوشتن یک Privacy Policy ساده (لازم برای Play Console).
- نسخه‌ی iOS هم می‌خوای؟ همین پروژه‌ی Capacitor با `npx cap add ios` قابل تبدیله.
