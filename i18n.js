// i18n.js
const i18n = {
    translations: {},
    currentLang: 'ko', // Default language

    async loadTranslations() {
        try {
            const lang = localStorage.getItem('lang') || this.currentLang;
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}.`);
            }
            this.translations = await response.json();
            this.currentLang = lang;
            this.applyTranslations();
            this.updateMetaTags(); // Call new function to update meta tags
        } catch (error) {
            console.error("Error loading translations:", error);
            // Fallback to default if loading fails
            const response = await fetch(`/locales/${this.currentLang}.json`);
            this.translations = await response.json();
            this.applyTranslations();
            this.updateMetaTags(); // Call new function to update meta tags
        }
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (this.translations[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.translations[key];
                } else if (element.tagName === 'IMG') {
                    element.alt = this.translations[key];
                } else if (element.tagName === 'TITLE') {
                    // Title is handled by updateMetaTags, but also keep this for direct setting
                    document.title = this.translations[key];
                }
                else {
                    element.innerHTML = this.translations[key];
                }
            } else {
                console.warn(`Missing translation for key: ${key} in ${this.currentLang}.json`);
            }
        });
        // Update hardcoded navigation links that are part of the header structure.
        // This is a temporary solution until the header itself is made dynamic.
        document.querySelector('.header .logo a').innerHTML = this.translations.siteTitle;
        document.querySelector('.nav ul li:nth-child(1) a').innerHTML = this.translations.navHome;
        document.querySelector('.nav ul li:nth-child(2) a').innerHTML = this.translations.navAbout;
        document.querySelector('.nav ul li:nth-child(3) a').innerHTML = this.translations.navBlog;
        document.querySelector('.nav ul li:nth-child(4) a').innerHTML = this.translations.navContact;
        document.querySelector('.footer p').innerHTML = this.translations.footerCopyright;
        document.querySelector('.footer-links a[href="privacy.html"]').innerHTML = this.translations.footerPrivacyPolicy;
        document.querySelector('.footer-links a[href="terms.html"]').innerHTML = this.translations.footerTermsOfService;


        // Special handling for the dynamic report content in main.js
        if (typeof updateReportContentI18n === 'function') {
             updateReportContentI18n(); // Call a function defined in main.js
        }
    },

    updateMetaTags() {
        const path = window.location.pathname;
        let titleKey = 'siteTitle';
        let descKey = 'homeSubtitle'; // Default description

        // Determine specific keys based on page
        if (path.includes('about.html')) {
            titleKey = 'aboutTitle';
            descKey = 'aboutParagraphFashionValue1';
        } else if (path.includes('contact.html')) {
            titleKey = 'contactTitle';
            descKey = 'contactSubtitle';
        } else if (path.includes('privacy.html')) {
            titleKey = 'privacyTitle';
            descKey = 'privacySection1P1';
        } else if (path.includes('terms.html')) {
            titleKey = 'termsTitle';
            descKey = 'termsSection1P1';
        } else if (path.includes('blog.html')) {
            titleKey = 'blogTitle';
            descKey = 'blogArticle1Excerpt'; // Use an article excerpt as general blog description
        } else if (path.includes('blog-article-1.html')) {
            titleKey = 'article1Title';
            descKey = 'article1P1';
        } else if (path.includes('blog-article-2.html')) {
            titleKey = 'article2Title';
            descKey = 'article2P1';
        } else if (path.includes('blog-article-3.html')) {
            titleKey = 'article3Title';
            descKey = 'article3P1';
        }

        document.title = this.translations[titleKey] || this.translations.siteTitle;

        // Update Open Graph meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = this.translations[titleKey] || this.translations.siteTitle;

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.content = this.translations[descKey] || this.translations.homeSubtitle;
        
        // Update Twitter Card meta tags
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) twitterTitle.content = this.translations[titleKey] || this.translations.siteTitle;

        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription) twitterDescription.content = this.translations[descKey] || this.translations.homeSubtitle;

        // Note: og:image and twitter:image are set statically in HTML for now
        // If translated images are needed, keys for them would be added to JSON
    },

    setLanguage(lang) {
        if (this.currentLang === lang) return;
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        this.loadTranslations();
    },

    getTranslation(key) {
        return this.translations[key] || key;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    i18n.loadTranslations();
});
