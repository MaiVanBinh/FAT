const FatMatrix = require('./fat');

const NUMBER_OF_FAT = 100;
const NUMBER_OF_EPOCHS = 100;
const MUTATION_PROBABILITY = 0.25;
const NUMBER_BEST_AGAIN_LIMIT = 10;
let fats = [];

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

const app = () => {
    // init Fat array
    for(let i = 0; i < NUMBER_OF_FAT; i++) {
        const arr = FatMatrix.randomFat();
        const fatMatrix = new FatMatrix(arr);
        fats.push(fatMatrix);
    }

    // sort and pic top of haft
    fats = sortFat(fats).slice(0,NUMBER_OF_FAT/2);

    // print score of FAT in EPOCHS have min score
    console.log(`EPOCHS${0}: ${fats[0].score}`);

    let bestFatScore = fats[0].score;
    let countFatAgain = 0;

    // mating
    loop1:
    for(let epoch = 0; epoch < NUMBER_OF_EPOCHS; epoch++){
        // mating to have a haft of population for next population
        for(let i = 0; i < NUMBER_OF_FAT/4; i++) {
            const motherIndex = Math.floor(Math.random()*(NUMBER_OF_FAT/2 - 1));
            const fatherIndex = Math.floor(Math.random()*(NUMBER_OF_FAT/2 - 1));

            let [offspring1, offspring2] = fats[motherIndex].mate(fats[fatherIndex]);

            offspring1 = new FatMatrix(initFat(offspring1));
            offspring2 = new FatMatrix(initFat(offspring2));

            // Đột biến
            if (Math.random() < MUTATION_PROBABILITY) {
                offspring1.mutate_swap();
            }
            if (Math.random() < MUTATION_PROBABILITY) {
                offspring2.mutate_swap();
            }

            // Thêm FAT mới và mảng arr
            fats.push(offspring1);
            fats.push(offspring2);
        }

        // Sắp xếp lại mảng
        fats = sortFat(fats).slice(0,NUMBER_OF_FAT/2);
        
        // In ra best score trong từng thế hệ
        console.log(`EPOCHS${epoch+1} best score: ${fats[0].score}`);

        // Check điều kiện nếu best score lặp lại trong nhiều thế hệ
        if(bestFatScore === fats[0].score){
            countFatAgain += 1;
            if(countFatAgain === NUMBER_BEST_AGAIN_LIMIT){
                break loop1;
            }
        } else{ 
            bestFatScore = fats[0].score;
            countFatAgain = 0;
        }
    }
    // print best choice FAT
    console.log('THE BEST CHOICE: ')
    console.log(fats.slice(0,1)[0]);
}

app();