// 동물 데이터
const animals = [
  {
    name: '강아지',
    emoji: '🐶',
    desc: '충성스럽고 활발한 에너지가 느껴져요! 사람들과 어울리는 걸 좋아하고 친근한 인상이에요.',
    traits: { eyeSize: 'large', faceShape: 'round', expression: 'happy' }
  },
  {
    name: '고양이',
    emoji: '🐱',
    desc: '도도하면서도 매력적인 분위기! 독립적이고 신비로운 느낌이 나요.',
    traits: { eyeSize: 'large', faceShape: 'oval', expression: 'neutral' }
  },
  {
    name: '여우',
    emoji: '🦊',
    desc: '영리하고 세련된 인상이에요! 날카로운 눈매와 매력적인 미소가 포인트.',
    traits: { eyeSize: 'medium', faceShape: 'angular', expression: 'sly' }
  },
  {
    name: '곰',
    emoji: '🐻',
    desc: '듬직하고 포근한 느낌! 믿음직스럽고 따뜻한 인상이에요.',
    traits: { eyeSize: 'small', faceShape: 'round', expression: 'calm' }
  },
  {
    name: '토끼',
    emoji: '🐰',
    desc: '귀엽고 사랑스러운 인상! 순수하고 부드러운 분위기가 나요.',
    traits: { eyeSize: 'large', faceShape: 'oval', expression: 'innocent' }
  },
  {
    name: '사자',
    emoji: '🦁',
    desc: '카리스마 넘치는 리더 스타일! 당당하고 자신감 있는 인상이에요.',
    traits: { eyeSize: 'medium', faceShape: 'square', expression: 'confident' }
  },
  {
    name: '올빼미',
    emoji: '🦉',
    desc: '지적이고 신중한 분위기! 깊은 생각에 잠긴 듯한 현명한 인상이에요.',
    traits: { eyeSize: 'large', faceShape: 'round', expression: 'wise' }
  },
  {
    name: '판다',
    emoji: '🐼',
    desc: '친근하고 평화로운 느낌! 여유롭고 사랑받는 인상이에요.',
    traits: { eyeSize: 'large', faceShape: 'round', expression: 'peaceful' }
  },
  {
    name: '늑대',
    emoji: '🐺',
    desc: '신비롭고 강인한 인상! 독립적이면서도 의리있는 분위기가 나요.',
    traits: { eyeSize: 'medium', faceShape: 'angular', expression: 'intense' }
  },
  {
    name: '햄스터',
    emoji: '🐹',
    desc: '통통하고 귀여운 매력! 먹는 걸 좋아하고 복슬복슬한 느낌이에요.',
    traits: { eyeSize: 'small', faceShape: 'round', expression: 'cute' }
  }
];

// DOM 요소
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const loading = document.getElementById('loading');
const captureBtn = document.getElementById('captureBtn');
const result = document.getElementById('result');
const retryBtn = document.getElementById('retryBtn');
const animalEmoji = document.getElementById('animalEmoji');
const animalName = document.getElementById('animalName');
const animalDesc = document.getElementById('animalDesc');
const matchPercent = document.getElementById('matchPercent');
const matchText = document.getElementById('matchText');

let modelsLoaded = false;

// face-api.js 모델 로드
async function loadModels() {
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    modelsLoaded = true;
    loading.classList.add('hidden');
    captureBtn.disabled = false;
  } catch (error) {
    console.error('모델 로딩 실패:', error);
    loading.innerHTML = '<p>모델 로딩에 실패했습니다.<br>페이지를 새로고침해주세요.</p>';
  }
}

// 웹캠 시작
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 }
    });
    video.srcObject = stream;
    await video.play();

    // 캔버스 크기 설정
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;

    // 모델 로드
    await loadModels();
  } catch (error) {
    console.error('카메라 접근 실패:', error);
    loading.innerHTML = '<p>카메라 접근이 필요합니다.<br>카메라 권한을 허용해주세요.</p>';
  }
}

// 얼굴 특징 분석
function analyzeFaceFeatures(landmarks, expressions) {
  const positions = landmarks.positions;

  // 눈 크기 계산 (왼쪽 눈 기준)
  const leftEye = landmarks.getLeftEye();
  const eyeWidth = Math.abs(leftEye[3].x - leftEye[0].x);
  const eyeHeight = Math.abs(leftEye[4].y - leftEye[1].y);
  const eyeRatio = eyeHeight / eyeWidth;

  // 얼굴 형태 계산
  const jawOutline = landmarks.getJawOutline();
  const faceWidth = Math.abs(jawOutline[16].x - jawOutline[0].x);
  const faceHeight = Math.abs(jawOutline[8].y - positions[27].y);
  const faceRatio = faceHeight / faceWidth;

  // 눈 크기 분류
  let eyeSize;
  if (eyeRatio > 0.35) eyeSize = 'large';
  else if (eyeRatio > 0.25) eyeSize = 'medium';
  else eyeSize = 'small';

  // 얼굴 형태 분류
  let faceShape;
  if (faceRatio > 1.3) faceShape = 'oval';
  else if (faceRatio > 1.1) faceShape = 'angular';
  else if (faceRatio > 0.9) faceShape = 'square';
  else faceShape = 'round';

  // 표정 분석
  const expEntries = Object.entries(expressions);
  const dominantExp = expEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return {
    eyeSize,
    faceShape,
    dominantExpression: dominantExp,
    eyeRatio,
    faceRatio,
    expressions
  };
}

// 동물 매칭
function matchAnimal(features) {
  const scores = animals.map(animal => {
    let score = 50; // 기본 점수

    // 눈 크기 매칭
    if (animal.traits.eyeSize === features.eyeSize) {
      score += 15;
    } else if (
      (animal.traits.eyeSize === 'large' && features.eyeSize === 'medium') ||
      (animal.traits.eyeSize === 'medium' && features.eyeSize === 'large') ||
      (animal.traits.eyeSize === 'medium' && features.eyeSize === 'small') ||
      (animal.traits.eyeSize === 'small' && features.eyeSize === 'medium')
    ) {
      score += 8;
    }

    // 얼굴 형태 매칭
    if (animal.traits.faceShape === features.faceShape) {
      score += 20;
    } else if (
      (animal.traits.faceShape === 'round' && features.faceShape === 'oval') ||
      (animal.traits.faceShape === 'oval' && features.faceShape === 'round')
    ) {
      score += 10;
    }

    // 표정 기반 보너스
    const exp = features.expressions;
    if (animal.name === '강아지' && (exp.happy > 0.3 || exp.surprised > 0.3)) score += 10;
    if (animal.name === '고양이' && exp.neutral > 0.4) score += 10;
    if (animal.name === '사자' && (exp.angry > 0.2 || exp.neutral > 0.3)) score += 10;
    if (animal.name === '토끼' && (exp.surprised > 0.3 || exp.happy > 0.2)) score += 10;
    if (animal.name === '곰' && exp.neutral > 0.5) score += 10;
    if (animal.name === '여우' && exp.happy > 0.2 && exp.neutral > 0.2) score += 10;
    if (animal.name === '올빼미' && exp.surprised > 0.2) score += 10;
    if (animal.name === '늑대' && (exp.angry > 0.1 || exp.sad > 0.2)) score += 10;
    if (animal.name === '판다' && exp.neutral > 0.4) score += 10;
    if (animal.name === '햄스터' && exp.happy > 0.3) score += 10;

    // 랜덤 요소 추가 (재미를 위해)
    score += Math.random() * 10;

    return { animal, score: Math.min(score, 95) };
  });

  // 최고 점수 동물 선택
  scores.sort((a, b) => b.score - a.score);
  return scores[0];
}

// 사진 찍기 및 분석
async function capture() {
  if (!modelsLoaded) return;

  captureBtn.disabled = true;
  captureBtn.textContent = '분석 중...';

  // 얼굴 감지
  const detections = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  if (!detections) {
    alert('얼굴을 찾을 수 없어요! 카메라를 정면으로 바라봐주세요.');
    captureBtn.disabled = false;
    captureBtn.textContent = '📸 사진 찍기';
    return;
  }

  // 얼굴 특징 분석
  const features = analyzeFaceFeatures(detections.landmarks, detections.expressions);

  // 동물 매칭
  const match = matchAnimal(features);

  // 결과 표시
  showResult(match);
}

// 결과 표시
function showResult(match) {
  const { animal, score } = match;
  const percentage = Math.round(score);

  animalEmoji.textContent = animal.emoji;
  animalName.textContent = `${animal.name} 상`;
  animalDesc.textContent = animal.desc;
  matchText.textContent = `닮은 정도: ${percentage}%`;

  // 카메라 숨기기
  document.querySelector('.camera-container').style.display = 'none';
  captureBtn.style.display = 'none';

  // 결과 표시
  result.classList.remove('hidden');

  // 애니메이션으로 퍼센트 바 채우기
  setTimeout(() => {
    matchPercent.style.width = `${percentage}%`;
  }, 100);
}

// 다시 시도
function retry() {
  result.classList.add('hidden');
  document.querySelector('.camera-container').style.display = 'block';
  captureBtn.style.display = 'inline-block';
  captureBtn.disabled = false;
  captureBtn.textContent = '📸 사진 찍기';
  matchPercent.style.width = '0%';
}

// 이벤트 리스너
captureBtn.addEventListener('click', capture);
retryBtn.addEventListener('click', retry);

// 앱 시작
startCamera();
