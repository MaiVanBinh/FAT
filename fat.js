const { evaluteFAT  } = require('./init');

function randomAllocation() {
    return x = Math.round(Math.random());
} 

// check have any fragment don't have site
function checkAllEqualZero(arr = []) {
    const findIndex = arr.findIndex(item => item === 1);
    if(findIndex === -1) {
        return true;
    }
    return false;
}

class FatMatrix {
    // init swapLength
    site = 4;
    frament = 4;
    swapLength = Math.floor((this.site*this.frament - 1)/3);
    constructor(FAT) {
        this.FAT = FAT;
        this.score = evaluteFAT(FAT);
    }

    static randomFat(sites = 4, framents = 4) {
        let FAT = []
        for(let i = 0; i < framents; i++){
            let arr = [];
            for(let j = 0; j < sites; j++) {
                arr.push(randomAllocation());
            }
            if(checkAllEqualZero(arr)) {
                // random from 0 to 3
                const randomNumber = Math.floor(Math.random()*4);
                arr[randomNumber] = 1;
            }
            FAT.push(arr);
        }
        return FAT;
    }

    mate(fatherFat) {
        // trả về hai FAT là con của được sinh ra từ cha và mẹ
        //Random vị trí bắt đầu swap đủ nhỏ để cộng với swap length < 16 - số phần tử của FAT
        let swapPositionStart = Math.ceil((15 - this.swapLength)*Math.random());
        let swapPositionEnd = swapPositionStart + this.swapLength;
        let i1 = Math.floor(swapPositionStart / 4)
        let j1 = swapPositionStart % 4;
        let i2 = Math.floor(swapPositionEnd / 4)
        let j2 = swapPositionEnd % 4;
        for(let j = j1; j < 4; j++){
            [this.FAT[i1][j], fatherFat.FAT[i1][j]] =[fatherFat.FAT[i1][j], this.FAT[i1][j]];
        }
        for(let i = i1 + 1; i < i2; i++) {
            [this.FAT[i], fatherFat.FAT[i]] = [fatherFat.FAT[i], this.FAT[i]]
        }
        for(let j = 0; j <= j2; j++){
            [this.FAT[i2][j], fatherFat.FAT[i2][j]] =[fatherFat.FAT[i2][j], this.FAT[i2][j]];
        }
        return [this.FAT, fatherFat.FAT]
    }

    mutate_swap(){
        // Phép đột biến
        let swapPositionStart = Math.floor(15*Math.random());
        let swapPositionDestination = Math.floor(15*Math.random());
        let i1 = Math.floor(swapPositionStart / 4)
        let j1 = swapPositionStart % 4;
        let i2 = Math.floor(swapPositionDestination / 4)
        let j2 = swapPositionDestination % 4;
        [this.FAT[i1, j1], this.FAT[i2, j2]] = [this.FAT[i2, j2], this.FAT[i1, j1]];
    }
}

module.exports = FatMatrix;