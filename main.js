// main.js

// This function needs to be global or accessible by i18n.js
// It will be called by i18n.js when language changes to re-render the report
function updateReportContentI18n() {
    // If a report is currently displayed, re-generate it with the new language
    const resultSection = document.getElementById('result');
    if (resultSection && !resultSection.classList.contains('hidden')) {
        const reportContent = document.getElementById('report-content');
        if (reportContent) {
            reportContent.innerHTML = generateStyleReport();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element Selectors ---
  const uploadContainer = document.getElementById('upload-container');
  const imageUpload = document.getElementById('image-upload');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const uploadPlaceholder = document.getElementById('upload-placeholder');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const loading = document.getElementById('loading');
  const resultSection = document.getElementById('result');
  const reportContent = document.getElementById('report-content');
  const retryBtn = document.getElementById('retryBtn');

  // --- Event Listeners ---

  // Handle file selection (this event listener remains for when a file is actually chosen)
  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  });

  // Handle drag and drop
  uploadContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadContainer.style.borderColor = 'var(--primary-color)';
  });
  uploadContainer.addEventListener('dragleave', (event) => {
    event.preventDefault();
    uploadContainer.style.borderColor = 'var(--border-color)';
  });
  uploadContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadContainer.style.borderColor = 'var(--border-color)';
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  });

  // Handle analysis button click
  analyzeBtn.addEventListener('click', () => {
    startAnalysis();
  });

  // Handle retry button click
  retryBtn.addEventListener('click', () => {
    resetApp();
  });

  // --- Core Functions ---

  /**
   * Processes the uploaded image file.
   * @param {File} file The image file uploaded by the user.
   */
  function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      uploadPlaceholder.classList.add('hidden');
      imagePreviewContainer.classList.remove('hidden');
      analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Simulates the AI analysis process.
   */
  function startAnalysis() {
    // Hide upload section and show loading spinner
    uploadContainer.classList.add('hidden');
    analyzeBtn.classList.add('hidden');
    loading.classList.remove('hidden');
    resultSection.classList.add('hidden');

    // Simulate a delay for "AI processing"
    setTimeout(() => {
      const reportHTML = generateStyleReport();
      reportContent.innerHTML = reportHTML;

      // Hide loading spinner and show results
      loading.classList.add('hidden');
      resultSection.classList.remove('hidden');
    }, 2500); // 2.5 second delay
  }

  /**
   * Resets the application to its initial state.
   */
  function resetApp() {
    resultSection.classList.add('hidden');
    imagePreview.src = '#';
    imagePreviewContainer.classList.add('hidden');
    uploadPlaceholder.classList.remove('hidden');
    uploadContainer.classList.remove('hidden');
    analyzeBtn.classList.remove('hidden');
    analyzeBtn.disabled = true;
    imageUpload.value = ''; // Clear the file input
  }

  /**
   * Generates a randomized, detailed style report.
   * This is the core of providing "high-value content".
   * @returns {string} HTML string of the generated report.
   */
  function generateStyleReport() {
    // --- Data for randomization ---
    const personalColors = [
      {
        name: i18n.getTranslation('personalColorSpringName'),
        desc: i18n.getTranslation('personalColorSpringDesc')
      },
      {
        name: i18n.getTranslation('personalColorSummerName'),
        desc: i18n.getTranslation('personalColorSummerDesc')
      },
      {
        name: i18n.getTranslation('personalColorAutumnName'),
        desc: i18n.getTranslation('personalColorAutumnDesc')
      },
      {
        name: i18n.getTranslation('personalColorWinterName'),
        desc: i18n.getTranslation('personalColorWinterDesc')
      },
    ];

    const fashionItems = [
      i18n.getTranslation('fashionItem1'),
      i18n.getTranslation('fashionItem2'),
      i18n.getTranslation('fashionItem3'),
      i18n.getTranslation('fashionItem4'),
      i18n.getTranslation('fashionItem5'),
      i18n.getTranslation('fashionItem6'),
      i18n.getTranslation('fashionItem7'),
      i18n.getTranslation('fashionItem8'),
      i18n.getTranslation('fashionItem9'),
    ];

    const stylingTips = [
      i18n.getTranslation('stylingTip1'),
      i18n.getTranslation('stylingTip2'),
      i18n.getTranslation('stylingTip3'),
      i18n.getTranslation('stylingTip4'),
      i18n.getTranslation('stylingTip5'),
    ];
    
    const overallImpressions = [
        i18n.getTranslation('overallImpression1'),
        i18n.getTranslation('overallImpression2'),
        i18n.getTranslation('overallImpression3'),
        i18n.getTranslation('overallImpression4')
    ];

    // --- Randomly select content ---
    const selectedColor = personalColors[Math.floor(Math.random() * personalColors.length)];
    const selectedImpression = overallImpressions[Math.floor(Math.random() * overallImpressions.length)];
    const selectedItems = [...fashionItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    const selectedTip = stylingTips[Math.floor(Math.random() * stylingTips.length)];

    // --- Build the HTML string ---
    return `
      <h3 data-i18n-key="reportSectionOverallImpression">${i18n.getTranslation('reportSectionOverallImpression')}</h3>
      <p>${selectedImpression}</p>
      
      <h3 data-i18n-key="reportSectionPersonalColorDiagnosis">${i18n.getTranslation('reportSectionPersonalColorDiagnosis')}</h3>
      <p><strong>${selectedColor.name}:</strong> ${selectedColor.desc}</p>
      
      <h3 data-i18n-key="reportSectionRecommendedFashionItems">${i18n.getTranslation('reportSectionRecommendedFashionItems')}</h3>
      <ul>
        <li>${selectedItems[0]}</li>
        <li>${selectedItems[1]}</li>
        <li>${selectedItems[2]}</li>
      </ul>
      
      <h3 data-i18n-key="reportSectionTodaysStylingTip">${i18n.getTranslation('reportSectionTodaysStylingTip')}</h3>
      <p>${selectedTip}</p>
    `;
  }
});
