const fs = require('fs');
const path = require('path');

function getBase64Image(fileName) {
  try {
    const filePath = path.resolve(__dirname, '..', 'assets', fileName);
    const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
    const ext = path.extname(fileName).toLowerCase();
    const mime = (ext === '.jpg' || ext === '.jpeg') ? 'jpeg' : 'png';
    return `data:image/${mime};base64,${base64}`;
  } catch (error) {
    console.error(`[오류] ${fileName} 이미지를 찾을 수 없습니다. assets 폴더를 확인해주세요.`);
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
}

const ASSETS = {
  babaL11: getBase64Image('BabaLeftwiggle11.png'),
  babaL12: getBase64Image('BabaLeftwiggle12.png'),
  babaL21: getBase64Image('BabaLeftwiggle21.png'),
  babaL22: getBase64Image('BabaLeftwiggle22.png'),
  babaR11: getBase64Image('BabaRightwiggle11.png'),
  babaR12: getBase64Image('BabaRightwiggle12.png'),
  babaR21: getBase64Image('BabaRightwiggle21.png'),
  babaR22: getBase64Image('BabaRightwiggle22.png'),
  babaB11: getBase64Image('BabaBotWiggle11.png'),
  babaB12: getBase64Image('BabaBotWiggle12.png'),
  babaB21: getBase64Image('BabaBotWiggle21.png'),
  babaB22: getBase64Image('BabaBotWiggle22.png'),
  babaT11: getBase64Image('BabaTopWiggle11.png'),
  babaT12: getBase64Image('BabaTopWiggle12.png'),
  blockIs1: getBase64Image('is_1.png'),
  blockIs2: getBase64Image('is_2.png'),
  isOn1: getBase64Image('isOn_1.png'),
  isOn2: getBase64Image('isOn_2.png'),
  blockCommit1: getBase64Image('commit_1.png'), 
  blockCommit2: getBase64Image('commit_2.png'), 
  commitOn1: getBase64Image('commitOn_1.png'),
  commitOn2: getBase64Image('commitOn_2.png'),
  cloud: getBase64Image('cloud.png'), 
};

const LEVEL_COLORS = ['#E3E3E3', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

const LEVEL_MAP = {
  'NONE': 0,
  'FIRST_QUARTILE': 1,
  'SECOND_QUARTILE': 2,
  'THIRD_QUARTILE': 3,
  'FOURTH_QUARTILE': 4
};

function generateSvg(calendarData) {
  const width = 800; 
  const height = 450; 
  const tileSize = 10; const tileSpace = 13; 
  const assetSize = 30; const cloudSize = 22.5; const cloudOffset = (assetSize - cloudSize) / 2;
  const animDuration = 15; 

  // =======================================================================
  // baba movement keyframes 
  // =======================================================================
  const baPath = [
    [1,4], [2,4], [3,4], // B0 push
    [3,3], [2,3], [1,3], [1,4], [1,5], // B1 move back 
    [2,5], [3,5], [3,6], [4,6], [4,5], // B1 push and move up
    [4,6], [5,6], [6,6], [7,6], [7,5], // B2 move back (straight line)
    [6,5], [5,5], [5,6], [4,6], [4,5], // B2 push and move up
    [4,6], [3,6], [3,7], [2,7], [1,7], [1,6], // B3 move back
    [2,6], [3,6], [3,7], [4,7], [4,6], [4,5], // B3 push and move up (Step 34 completed)
    [4,6], // one tile down (Step 35)
    [4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6] // rest
  ];
  const STEPS = baPath.length - 1; // 45 스텝

  let babaKF = `@keyframes moveBaba { `;
  let dirHistory = []; let curAct = 1; let curDir = 'R';
  let cloudStyles = ''; let cloudsSvg = '';

  for(let i=0; i<STEPS; i++) {
    let p1 = baPath[i]; let p2 = baPath[i+1];
    let startPct = (i / STEPS) * 100;
    let moveEndPct = ((i + 0.6) / STEPS) * 100; 
    let endPct = ((i + 1) / STEPS) * 100;

    babaKF += `${startPct}% { transform: translate(${p1[0]*assetSize}px, ${p1[1]*assetSize}px); } `;
    babaKF += `${moveEndPct}%, ${endPct - 0.01}% { transform: translate(${p2[0]*assetSize}px, ${p2[1]*assetSize}px); } `;

    let dx = p2[0] - p1[0]; let dy = p2[1] - p1[1];
    
    // 방향 감지 (움직일 때만 업데이트)
    if(dx > 0) curDir = 'R'; else if(dx < 0) curDir = 'L';
    else if(dy > 0) curDir = 'B'; else if(dy < 0) curDir = 'T';
    
    if (dx !== 0 || dy !== 0) curAct = (curAct === 1) ? 2 : 1; 
    let stateKey = curDir + (curDir === 'T' ? '1' : curAct); 
    dirHistory.push(stateKey);

   if (dx !== 0 || dy !== 0) {
      let dustTx = dx > 0 ? -15 : dx < 0 ? 15 : 0;
      let dustTy = dy > 0 ? -15 : dy < 0 ? 15 : 0;
      let dustEnd = startPct + (2 / STEPS) * 100;
      
      cloudStyles += `@keyframes cl-${i} { 
        0%, ${Math.max(0, startPct - 0.01)}% { opacity: 0; transform: translate(0px, 0px) scale(1); } 
        ${startPct}% { opacity: 1; transform: translate(0px, 0px) scale(1); } 
        ${dustEnd}% { opacity: 0; transform: translate(${dustTx}px, ${dustTy}px) scale(0.2); } 
        ${dustEnd + 0.01}%, 100% { opacity: 0; transform: translate(${dustTx}px, ${dustTy}px) scale(0.2); } 
      } 
      .c-${i} { animation: cl-${i} ${animDuration}s infinite; transform-origin: center; transform-box: fill-box; } `;
      
      cloudsSvg += `<g transform="translate(${p1[0]*assetSize + cloudOffset}, ${p1[1]*assetSize + cloudOffset})"><image href="${ASSETS.cloud}" width="${cloudSize}" height="${cloudSize}" class="c-${i}" /></g>`;
    }
  }
  babaKF += `100% { transform: translate(${baPath[STEPS][0]*assetSize}px, ${baPath[STEPS][1]*assetSize}px); } }`;

  let babaStateStyles = '';
  let uniqueStates = ['R1', 'R2', 'L1', 'L2', 'B1', 'B2', 'T1'];
  
  uniqueStates.forEach(state => {
    let kf = `@keyframes op-${state} { \n`;
    let isActive = false;
    for (let i=0; i<=STEPS; i++) {
      let pct = (i / STEPS) * 100;
      let curState = i < STEPS ? dirHistory[i] : dirHistory[STEPS-1];
      let isMatch = (curState === state);
      
      if (isMatch && !isActive) {
        if (pct > 0) kf += `  ${pct - 0.001}% { opacity: 0; }\n`;
        kf += `  ${pct}% { opacity: 1; }\n`;
        isActive = true;
      } else if (!isMatch && isActive) {
        kf += `  ${pct - 0.001}% { opacity: 1; }\n`;
        kf += `  ${pct}% { opacity: 0; }\n`;
        isActive = false;
      } else if (i === 0 && !isMatch) {
        kf += `  0% { opacity: 0; }\n`;
      }
    }
    kf += `  100% { opacity: ${isActive ? 1 : 0}; }\n}\n`;
    babaStateStyles += `${kf}.st-${state} { opacity: 0; animation: op-${state} ${animDuration}s infinite; }\n`;
  });

  // =======================================================================
  // block movement keyframes (B0~B3) 
  // =======================================================================
  const b0Steps = { 0:[2,4], 1:[3,4], 2:[4,4], 12:[4,3], 22:[4,2], 34:[4,1] };
  const b1Steps = { 0:[2,5], 8:[3,5], 9:[4,5], 12:[4,4], 22:[4,3], 34:[4,2] };
  const b2Steps = { 0:[6,5], 18:[5,5], 19:[4,5], 22:[4,4], 34:[4,3] };
  const b3Steps = { 0:[2,6], 29:[3,6], 30:[4,6], 33:[4,5], 34:[4,4] };

  function makeBlockKF(name, stepsObj) {
    let kf = `@keyframes ${name} { `;
    let sortedSteps = Object.keys(stepsObj).map(Number).sort((a,b)=>a-b);
    let curPos = stepsObj[0];
    kf += `0% { transform: translate(${curPos[0]*assetSize}px, ${curPos[1]*assetSize}px); } `;
    for(let j=1; j<sortedSteps.length; j++) {
      let nextStep = sortedSteps[j]; let nextPos = stepsObj[nextStep];
      let holdEndPct = ((nextStep - 1) / STEPS) * 100;
      if (holdEndPct > 0) kf += `${holdEndPct}% { transform: translate(${curPos[0]*assetSize}px, ${curPos[1]*assetSize}px); } `;
      let moveEndPct = ((nextStep - 1 + 0.6) / STEPS) * 100; 
      let arrivePct = (nextStep / STEPS) * 100;
      kf += `${moveEndPct}%, ${arrivePct}% { transform: translate(${nextPos[0]*assetSize}px, ${nextPos[1]*assetSize}px); } `;
      curPos = nextPos;
    }
    kf += `100% { transform: translate(${curPos[0]*assetSize}px, ${curPos[1]*assetSize}px); } }`;
    return kf;
  }

  // =======================================================================
  // on/off toggle keyframes for blocks and is/commit states 
  // =======================================================================
  const pops = [2, 12, 22, 34]; // B0~B3가 꽂히는 스텝
  
  function makePopKF(name, baseLevel) {
    let kf = `@keyframes ${name} { `;
    let curLvl = baseLevel;
    
    kf += `0% { fill: ${LEVEL_COLORS[curLvl]}; transform: scale(1); } `;

    for(let i = 0; i < pops.length; i++) {
      const popStep = pops[i];
      
      // i (블럭 푸시 순서)가 baseLevel (잔디의 초기 레벨)보다 크거나 같을 때만 레벨업을 시작합니다.
      if (i >= baseLevel) {
        const nextLvl = Math.min(4, curLvl + 1);
        
        if (nextLvl !== curLvl) {
          const startPct = ((popStep - 1 + 0.6) / STEPS) * 100; 
          const settlePct = startPct + 3; 

          kf += `${startPct - 0.1}% { fill: ${LEVEL_COLORS[curLvl]}; transform: scale(1); } `;
          kf += `${startPct}% { fill: ${LEVEL_COLORS[nextLvl]}; transform: scale(1.4); } `;
          kf += `${settlePct}% { fill: ${LEVEL_COLORS[nextLvl]}; transform: scale(1); } `;
          
          curLvl = nextLvl;
        }
      }
    }
    
    kf += `100% { fill: ${LEVEL_COLORS[curLvl]}; transform: scale(1); } }`;
    return kf;
  }


  const switchPct = ((pops[0] - 1 + 0.6) / STEPS) * 100;
  const onOffCSS = `
    @keyframes blkOff { 0%, ${switchPct}% { opacity: 1; visibility: visible; } ${switchPct + 0.01}%, 100% { opacity: 0; visibility: hidden; } }
    @keyframes blkOn { 0%, ${switchPct}% { opacity: 0; visibility: hidden; } ${switchPct + 0.01}%, 100% { opacity: 1; visibility: visible; } }
    .b-off { animation: blkOff ${animDuration}s infinite; }
    .b-on { animation: blkOn ${animDuration}s infinite; }
  `;

  const style = `
    <style>
      .graph-tile { transform-box: fill-box; transform-origin: center; }
      ${makePopKF('popLevel0', 0)}
      ${makePopKF('popLevel1', 1)}
      ${makePopKF('popLevel2', 2)}
      ${makePopKF('popLevel3', 3)}
      .initial-lvl-0 { animation: popLevel0 ${animDuration}s infinite; }
      .initial-lvl-1 { animation: popLevel1 ${animDuration}s infinite; }
      .initial-lvl-2 { animation: popLevel2 ${animDuration}s infinite; }
      .initial-lvl-3 { animation: popLevel3 ${animDuration}s infinite; }

      ${babaKF}
      ${makeBlockKF('moveB0', b0Steps)}
      ${makeBlockKF('moveB1', b1Steps)}
      ${makeBlockKF('moveB2', b2Steps)}
      ${makeBlockKF('moveB3', b3Steps)}
      ${babaStateStyles}
      ${cloudStyles}
      ${onOffCSS}

      @keyframes wiggle1 { 0%, 49.9% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes wiggle2 { 0%, 49.9% { opacity: 0; } 50%, 100% { opacity: 1; } }

      .baba-char { animation: moveBaba ${animDuration}s infinite; }
      .b-0 { animation: moveB0 ${animDuration}s infinite; }
      .b-1 { animation: moveB1 ${animDuration}s infinite; }
      .b-2 { animation: moveB2 ${animDuration}s infinite; }
      .b-3 { animation: moveB3 ${animDuration}s infinite; }

      .wig-1 { animation: wiggle1 0.4s infinite; }
      .wig-2 { animation: wiggle2 0.4s infinite; }

      .cloud-particle { opacity: 0; transform-box: fill-box; transform-origin: center; }
      .baba-char, .b-0, .b-1, .b-2, .b-3 { will-change: transform; }
    </style>
  `;

  let graphSvg = '<g transform="translate(40, 40)">';
  calendarData.weeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach((day, dayIndex) => {
      const x = weekIndex * tileSpace; const y = dayIndex * tileSpace;
      const level = LEVEL_MAP[day.contributionLevel] ?? 0;
      const levelClass = `initial-lvl-${level} graph-tile`;
      const initialFill = LEVEL_COLORS[level];
      graphSvg += `<rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="2" ry="2" fill="${initialFill}" class="${levelClass}" />`;
    });
  });
  graphSvg += '</g>';

  function getBlk(color) {
    return `<rect x="2" y="2" width="${assetSize-4}" height="${assetSize-4}" rx="4" fill="${color}" stroke="#1b1f23" stroke-width="2"/><rect x="5" y="5" width="${assetSize-10}" height="${assetSize-10}" rx="2" fill="#ffffff" opacity="0.2"/>`;
  }

  const animY = 160; 

  let animationSvg = `
    <g transform="translate(40, ${animY})">
      ${cloudsSvg}
      
      <g class="b-0">${getBlk(LEVEL_COLORS[0])}</g>
      <g class="b-1">${getBlk(LEVEL_COLORS[1])}</g>
      <g class="b-2">${getBlk(LEVEL_COLORS[2])}</g>
      <g class="b-3">${getBlk(LEVEL_COLORS[3])}</g>

      <g transform="translate(${5 * assetSize}, ${4 * assetSize})">
        <g class="b-off"><image href="${ASSETS.blockIs1}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-1" /><image href="${ASSETS.blockIs2}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-2" /></g>
        <g class="b-on"><image href="${ASSETS.isOn1}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-1" /><image href="${ASSETS.isOn2}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-2" /></g>
      </g>
      <g transform="translate(${6 * assetSize}, ${4 * assetSize})">
        <g class="b-off"><image href="${ASSETS.blockCommit1}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-1" /><image href="${ASSETS.blockCommit2}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-2" /></g>
        <g class="b-on"><image href="${ASSETS.commitOn1}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-1" /><image href="${ASSETS.commitOn2}" x="0" y="0" width="${assetSize}" height="${assetSize}" class="wig-2" /></g>
      </g>

      <g class="baba-char">
        <g class="st-R1"><image href="${ASSETS.babaR11}" width="${assetSize}" height="${assetSize}" class="wig-1"/><image href="${ASSETS.babaR12}" width="${assetSize}" height="${assetSize}" class="wig-2"/></g>
        <g class="st-R2"><image href="${ASSETS.babaR21}" width="${assetSize}" height="${assetSize}" class="wig-1"/><image href="${ASSETS.babaR22}" width="${assetSize}" height="${assetSize}" class="wig-2"/></g>
        <g class="st-L1"><image href="${ASSETS.babaL11}" width="${assetSize}" height="${assetSize}" class="wig-1"/><image href="${ASSETS.babaL12}" width="${assetSize}" height="${assetSize}" class="wig-2"/></g>
        <g class="st-L2"><image href="${ASSETS.babaL21}" width="${assetSize}" height="${assetSize}" class="wig-1"/><image href="${ASSETS.babaL22}" width="${assetSize}" height="${assetSize}" class="wig-2"/></g>
        <g class="st-B1"><image href="${ASSETS.babaB11}" width="${assetSize}" height="${assetSize}" class="wig-1"/><image href="${ASSETS.babaB12}" width="${assetSize}" height="${assetSize}" class="wig-2"/></g>
        <g class="st-B2"><image href="${ASSETS.babaB21}" width="${assetSize}" height="${assetSize}" class="wig-1"/><image href="${ASSETS.babaB22}" width="${assetSize}" height="${assetSize}" class="wig-2"/></g>
        <g class="st-T1"><image href="${ASSETS.babaT11}" width="${assetSize}" height="${assetSize}" class="wig-1"/><image href="${ASSETS.babaT12}" width="${assetSize}" height="${assetSize}" class="wig-2"/></g>
      </g>
    </g>
  `;
return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${style}
      <rect width="100%" height="100%" fill="#0D1329" />
      
      <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="none" stroke="#232844" stroke-width="${assetSize}" />
      
      ${graphSvg}
      ${animationSvg}
    </svg>
  `;
}

module.exports = generateSvg;
