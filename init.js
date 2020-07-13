const SIZE_OF_FRAGMENT = [40, 80, 50, 60];

const RM = [
  [2, 0, 3, 2],
  [0, 2, 2, 3],
  [3, 0, 1, 2],
  [4, 2, 4, 2],
];

const UM = [
  [2, 2, 3, 2],
  [0, 0, 2, 2],
  [3, 0, 2, 2],
  [2, 1, 2, 1],
];

const FREQ = [
  [2, 2, 1, 1],
  [2, 1, 2, 1],
  [4, 2, 1, 2],
  [5, 1, 2, 1],
];

const SEL = [
  [0.1, 0.3, 0.1, 0.4],
  [0.1, 0.3, 0.2, 0.4],
  [0.2, 0.5, 2, 0.4],
  [0.4, 0.2, 0.2, 3],
];

const CTR = [
  [0, 0.2, 0.2, 0.2],
  [0.2, 0, 0.5, 0.1],
  [0.2, 0.5, 0, 0.2],
  [0.2, 0.1, 0.2, 0],
];

const Cini = 5;
const  P_SIZE = 0.1;
const VCini = 5;
const SI = 1;


const calculateCommunicationCost = (sideId1, sideId2, m_size) => {
    return Cini*(m_size /P_SIZE) + CTR[sideId1][sideId2]*m_size;
}

const calculatorCCload = () => {
  let CCload = 0;
  for(let i = 0; i < FAT.length; i++){
    for(let j = 0; j < FAT[0].length; j++) {
      CCload += (FAT[i][j]*calculateCommunicationCost(SI,j, SIZE_OF_FRAGMENT[i]));
    }
  }
  return CCload;
}

const calculatorMinimumTransmissionCost = (sizeId = 0, transactionId = 0, fragmentId) => {
  let minTC = Infinity;
  for(let s = 0; s < FAT[0].length; s++){
    if(FAT[fragmentId][s] === 1) {
      const m_size = (SEL[transactionId][fragmentId]/100)*SIZE_OF_FRAGMENT[fragmentId];
      const result = calculateCommunicationCost(sizeId, s, m_size);
      if(minTC > result){
        minTC = result;
      }
    }
  }
  return minTC;
}

const calculatorTRi = (sizeId, transactionId) => {
  let total = 0;
  for(let j = 0; j < SIZE_OF_FRAGMENT.length; j++) {
    const minTC = calculatorMinimumTransmissionCost(sizeId, transactionId, j);
    const result = RM[transactionId][j]*minTC;
    total += result;
  }
  return total;
}

const calculatorTotalTransmissionCosts = (sizeId, transactionId, fragmentId) => {
  let total = 0;
  const m_size = (SEL[transactionId][fragmentId]/100)*SIZE_OF_FRAGMENT[fragmentId];
  const length = FAT[0].length;
  for(let l = 0; l< length; l++){
    const result = FAT[fragmentId][l]*calculateCommunicationCost(sizeId, l, m_size);
    total += result;
  }
  return total;
}

const calculatorTUi = (sizeId, transactionId) => {
  let total = 0;
  for(let j = 0; j < SIZE_OF_FRAGMENT.length; j++) {
    const totalTC = calculatorTotalTransmissionCosts(sizeId, transactionId, j);
    total += UM[transactionId][j]*totalTC;
  }
  return total;
}

const calculatorCCproc = () => {
  // let site = FAT[0].length;
  // let transaction = FAT.length;
  let CCproc = 0;
  for(let k = 0; k < 4; k++){
    for(let i = 0; i< 4; i++) {
      const TRi = calculatorTRi(k, i);
      const TUi = calculatorTUi(k, i);
      CCproc += FREQ[i][k]*(TRi + TUi + VCini)
    }
  }
  
  return CCproc;
}

exports.evaluteFAT = function(cFAT){
    FAT = cFAT
    let score = calculatorCCload() + calculatorCCproc();
    return score;
}
