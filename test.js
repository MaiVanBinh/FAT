const RM = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ];
const UM = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

let start = 3;
let end = 10;

let i1 = Math.floor(start / 4)
let j1 = start % 4;
let i2 = Math.floor(end / 4)
let j2 = end % 4;
for(let j = j1; j < 4; j++){
  [RM[i1][j], UM[i1][j]] =[UM[i1][j], RM[i1][j]];
}
for(let i = i1 + 1; i < i2; i++) {
  [RM[i], UM[i]] = [UM[i], RM[i]]
}
for(let j = 0; j <= j2; j++){
  [RM[i2][j], UM[i2][j]] =[UM[i2][j], RM[i2][j]];
}
// [RM[i][j], UM[i][j]] =[UM[i][j], RM[i][j]];
console.log(RM, '\n', UM);