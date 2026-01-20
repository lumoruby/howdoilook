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

  // Trigger file input when the placeholder is clicked
  uploadContainer.addEventListener('click', () => {
    imageUpload.click();
  });

  // Handle file selection
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
        name: '봄 웜톤 (Spring)',
        desc: '생기 있고 따뜻한 이미지를 가지고 있으며, 밝고 화사한 컬러가 잘 어울립니다. 아이보리, 코랄 핑크, 라이트 옐로우와 같은 색상이 당신의 매력을 한층 더 돋보이게 합니다.',
      },
      {
        name: '여름 쿨톤 (Summer)',
        desc: '부드럽고 시원한 이미지를 연출하며, 파스텔 톤의 차분한 컬러가 잘 어울립니다. 라벤더, 스카이 블루, 로즈 핑크와 같은 색상으로 우아함을 더해보세요.',
      },
      {
        name: '가을 웜톤 (Autumn)',
        desc: '깊고 성숙한 분위기를 자아내며, 차분하고 따뜻한 얼스(earth) 톤 컬러가 제격입니다. 카키, 버건디, 머스타드, 브라운 계열의 색상으로 지적인 매력을 발산할 수 있습니다.',
      },
      {
        name: '겨울 쿨톤 (Winter)',
        desc: '강렬하고 도시적인 이미지를 가지고 있으며, 선명한 고채도의 컬러나 무채색이 잘 어울립니다. 블랙, 화이트, 핫핑크, 코발트 블루와 같은 색상으로 시크하고 카리스마 있는 모습을 연출해보세요.',
      },
    ];

    const fashionItems = [
      '클래식한 트렌치 코트', '미니멀한 디자인의 블레이저', '편안하면서도 스타일리시한 와이드 팬츠',
      'A라인 실루엣의 롱 스커트', '고품질의 캐시미어 니트', '세련된 실크 블라우스',
      '어디에나 잘 어울리는 데님 자켓', '가죽 소재의 바이커 자켓', '활용도 높은 스트라이프 티셔츠',
    ];

    const stylingTips = [
      '상의와 하의의 색상을 톤온톤으로 매치하여 안정감 있고 세련된 룩을 연출해보세요.',
      '액세서리를 활용하여 포인트를 주는 것이 좋습니다. 심플한 의상에 볼드한 목걸이나 귀걸이를 더해보세요.',
      '신발과 가방의 색상이나 소재를 통일하면 전체적인 룩에 안정감을 줄 수 있습니다.',
      '세 가지 이상의 색상을 사용하지 않도록 주의하여 전체적인 조화를 맞추는 것이 중요합니다.',
      '실루엣의 균형을 생각하세요. 상의가 오버사이즈라면 하의는 슬림하게, 반대의 경우도 마찬가지입니다.',
    ];
    
    const overallImpressions = [
        '전체적으로 부드럽고 따뜻한 인상을 줍니다. 자연스러운 컬러와 소재를 활용하면 매력이 배가될 것입니다.',
        '지적이고 세련된 분위기가 돋보입니다. 미니멀하고 구조적인 디자인의 의류를 선택하는 것을 추천합니다.',
        '활기차고 긍정적인 에너지가 느껴집니다. 밝고 선명한 색상을 사용하여 개성을 표현해보세요.',
        '우아하고 차분한 매력을 가지고 있습니다. 흐르는 듯한 실루엣의 의상으로 여성스러움을 강조할 수 있습니다.'
    ];

    // --- Randomly select content ---
    const selectedColor = personalColors[Math.floor(Math.random() * personalColors.length)];
    const selectedImpression = overallImpressions[Math.floor(Math.random() * overallImpressions.length)];
    const selectedItems = [...fashionItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    const selectedTip = stylingTips[Math.floor(Math.random() * stylingTips.length)];

    // --- Build the HTML string ---
    return `
      <h3>✨ 총평</h3>
      <p>${selectedImpression}</p>
      
      <h3>🎨 퍼스널 컬러 진단</h3>
      <p><strong>${selectedColor.name}:</strong> ${selectedColor.desc}</p>
      
      <h3>👕 추천 패션 아이템</h3>
      <ul>
        <li>${selectedItems[0]}</li>
        <li>${selectedItems[1]}</li>
        <li>${selectedItems[2]}</li>
      </ul>
      
      <h3>💡 오늘의 스타일링 팁</h3>
      <p>${selectedTip}</p>
    `;
  }
});
