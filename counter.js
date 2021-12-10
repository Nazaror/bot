const count = function getFri() {
    const now = new Date();
    var d = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    d.setDate(d.getDate() + [-2, -3, -4, -5, -6, 0, -1][d.getDay()]);
    if(now.getDate() == d.getDate()){
        d = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        d.setDate(d.getDate() + [-2, -3, -4, -5, -6, 0, -1][d.getDay()]);

    }
    let diff = (d.getTime()-now.getTime())/1000;

    let days = Math.floor(diff/(60*60*24));
    diff%=60*60*24;
    let hours = Math.floor(diff/(60*60));
    diff%=60*60;
    let min = Math.floor(diff/60);

    diff%=60;
    diff = Math.floor(diff);
    return `${days} ${trueRussianDecline("днів","день","дня",days)} ${hours} ${trueRussianDecline("годин","година","години",hours)} ${min} ${trueRussianDecline("хвилин","хвилина","хвилини",min)} ${diff} ${trueRussianDecline("секунд","секунда","секунди",diff)}`;
}
function trueRussianDecline(d1, d2, d3, c){
    let res = "";
    switch (c%100){
        case 11: case 12: case 13: case 14:return d1;
        default:
            switch (c%10){
                case 0:case 5:case 6:case 7:case 8:case 9:return d1;
                case 1: return d2;
                case 2:case 3:case 4: return d3;
            }
    }
    return "";
}
module.exports.counter = count();