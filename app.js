// const FatMatrix = require('./fat');
const sortFat = (fatsList) => {
    // sort by score asc
    fatsList.sort((a, b) =>  a['score'] - b['score']);
    return fatsList;
} 

// check equal zero
function checkAllEqualZero(arr = []) {
    const findIndex = arr.findIndex(item => item === 1);
    if(findIndex === -1) {
        return true;
    }
    return false;
}
const initFat = (fat) => {
    for(let i = 0; i < 4; i++) {
        if(checkAllEqualZero(fat[i])) {
            fat[i][0] = 1;
        }
    }
    return fat;
}
const getInforOfMatrix = (mode) => {
    switch(mode) {
        case "SOF​": return {
            title: "Size of Fragment ​(MB)",
            rowTitle: "F",
            colTitle: "Size",
            
        };
        case "RM": return {
            title: "Read Matrix",
            rowTitle: "F",
            colTitle: "T"
        };
        case "UM": return {
            title: "Update Matrix",
            rowTitle: "F",
            colTitle: "T"
        };
        case "FREQ": return {
            title: "Frequency matrix",
            rowTitle: "S",
            colTitle: "T"
        };
        case "SEL": return {
            title: "Selectivity matrix",
            rowTitle: "F",
            colTitle: "T"
        };
        case "CTR": return {
            title: "Cost of transmitting matrix",
            rowTitle: "S",
            colTitle: "S"
        };
        case "FAT": return {
            title: "Fragment Allocation",
            rowTitle: "S",
            colTitle: "F"
        };
        default: return "lol";
    }
}

const createMatrixInput = (matrix, mode) => {
    let row = matrix.length;
    let column = matrix[0].length;

    let matrixInfor = getInforOfMatrix(mode);


    let table = `<h3>${matrixInfor.title}</h3>
        <table><tr><th></th>`;
    for (let i = 1; i <= column; i++) {
      table += `<th>${matrixInfor.rowTitle}${i}</th>`;
    }
    table += '</tr>';
    for (let i = 1; i <= row; i++) {
      table += `<tr><th>${mode === "SOF​" ? matrixInfor.colTitle : matrixInfor.colTitle + '' + i}</th>`;
      for (let j = 1; j <= column; j++) {
        table += `<td>${matrix[i-1][j-1]}</td>`;
      }
      table += '</tr>';
    }
    table += '</table>';
    document.getElementById(mode).innerHTML = table;
  };

// print matrix 
const initMatrix = () => {
    let modes = ["SOF​", "RM", "UM", "FREQ", "SEL", "CTR"];
    modes.forEach((mode, index) => {
        createMatrixInput(matrixType[index], mode);
    });
}

initMatrix();
/////////////
const app = () => {
    const NUMBER_OF_FAT = parseInt(document.getElementById("NUMBER_OF_FAT").value);
    if(NUMBER_OF_FAT <= 1 ){
        alert("Number of fat must larger than 1");
        return;
    }
    const NUMBER_OF_EPOCHS = parseInt(document.getElementById("NUMBER_OF_EPOCHS").value);
    const MUTATION_PROBABILITY = parseFloat(document.getElementById("MUTATION_PROBABILITY").value);
    const NUMBER_BEST_AGAIN_LIMIT = parseInt(document.getElementById("NUMBER_BEST_AGAIN_LIMIT").value);

    let fats = [];
    let resultContent = "<div>";
    
    for(let i = 0; i < NUMBER_OF_FAT; i++) {
        // init Fat array
        const arr = FatMatrix.randomFat();
        // Initial FAT matrix object
        const fatMatrix = new FatMatrix(arr);
        fats.push(fatMatrix);
    }

    // sort and pic top of haft
    fats = sortFat(fats).slice(0, NUMBER_OF_FAT/2);
    
    // print score of FAT in EPOCHS have min score
    resultContent += `<p>EPOCHS${0}: ${fats[0].score}</p>`;

    let bestFatScore = fats[0].score;
    let countFatAgain = 1;
    // mating
    loop1:
    for(let epoch = 0; epoch < NUMBER_OF_EPOCHS; epoch++){
        // mating to have a haft of population for next population
        for(let i = 0; i < NUMBER_OF_FAT/4; i++) {
            // Choose the mother and father
            const motherIndex = Math.floor(Math.random()*(NUMBER_OF_FAT/2 - 1));
            const fatherIndex = Math.floor(Math.random()*(NUMBER_OF_FAT/2 - 1));
            // Mating
            let [offspring1, offspring2] = fats[motherIndex].mate(fats[fatherIndex]);

            offspring1 = new FatMatrix(initFat(offspring1));
            offspring2 = new FatMatrix(initFat(offspring2));

            // Mutation
            if (Math.random() < MUTATION_PROBABILITY) {
                offspring1.mutate_swap();
            }
            if (Math.random() < MUTATION_PROBABILITY) {
                offspring2.mutate_swap();
            }

            // Thêm FAT mới vào mảng fats array
            fats.push(offspring1);
            fats.push(offspring2);
        }
        // Sắp xếp lại mảng
        fats = sortFat(fats).slice(0,NUMBER_OF_FAT/2);
        // In ra best score trong từng thế hệ
        resultContent += `<p>EPOCHS ${epoch+1} best score: ${fats[0].score}</p>`;
        // Check điều kiện nếu best score lặp lại trong nhiều thế hệ
        if(bestFatScore === fats[0].score){
            countFatAgain += 1;
            if(countFatAgain >= NUMBER_BEST_AGAIN_LIMIT){
                break loop1;
            }
        } else{ 
            bestFatScore = fats[0].score;
            countFatAgain = 1;
        }
    }
    // print best choice FAT
    resultContent += `<p><strong>THE BEST CHOICE:</strong> ${bestFatScore}</p>`;
    resultContent += "</div>";
    document.getElementById("result").innerHTML = resultContent;

    createMatrixInput(fats[0].FAT, "FAT");
}

