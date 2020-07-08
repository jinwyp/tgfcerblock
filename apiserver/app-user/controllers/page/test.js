/**
 * Created by jin on 8/2/17.
 */

/**
 * 快速排序
 * @param sourceArray
 * @param left
 * @param right
 */
function quickSort (sourceArray) {
    if (!Array.isArray(sourceArray) ) {
        return 'error : source array  error'
    }

    // 检查数组的元素个数，如果小于等于1，就返回。
    if (sourceArray.length <= 1) {
        return sourceArray
    }

    const pivotIndex = Math.floor(sourceArray.length / 2)
    const pivotValue = sourceArray.splice(pivotIndex, 1)[0]

    console.log('pivotValue and pivotIndex: ', pivotValue, pivotIndex)

    let leftArray = []
    let rightArray = []

    for (let i = 0; i < sourceArray.length; i++) {

        if (sourceArray[i] < pivotValue) {
            leftArray.push(sourceArray[i])
        } else {
            rightArray.push(sourceArray[i])
        }
    }

    return quickSort(leftArray).concat([pivotValue], quickSort(rightArray))

}

const arr = [1,3,6,3,23,76,1,34,222,6,456,221,556,75,30];
const arr2 = [85, 24, 63, 45, 17, 31, 96, 50,33,65,99,120,15];
// console.log(quickSort(arr2) );




/**
 * 数组二分查找
 *
 * 优点：比较次数少，查找速度快，平均性能好；
 * 缺点：是要求待查表为有序表，且插入删除困难。
 *
 * 基本思路：数组中间位置对应的值与需要查找的值比较，如果两者相等，则查找成功；
 * 否则利用中间位置记录将数组分成前、后两个子数组，如果中间位置记录的关键字大于查找关键字，则进一步查找前一子数组，否则进一步查找后一子数组，然后依递归。
 *
 */
function binarySearch (targetValue, sourceArray, start, end) {


    if (!Array.isArray(sourceArray) || !targetValue) {
        return 'error : source array or target error'
    }

    const len = sourceArray.length
    const startIndex = typeof start === 'number' ? start : 0
    const endIndex = typeof end === 'number' ? end : len - 1
    const midIndex = Math.floor((startIndex + endIndex) / 2)
    const midValue = sourceArray[midIndex]

    if (startIndex > endIndex) {
        return 'error : start greater than end '
    }

    if (targetValue > sourceArray[endIndex]) {
        return 'error : target greater than all source array'
    }

    if (targetValue < sourceArray[startIndex]) {
        return 'error : target smaller than all source array'
    }

    console.log('start & end & midIndex : ', start, end, midIndex)

    if (midValue === targetValue) {
        return midIndex
    } else if ( midValue > targetValue) {
        return binarySearch(targetValue, sourceArray, startIndex, midIndex - 1 )
    } else {
        return binarySearch(targetValue, sourceArray, midIndex + 1, endIndex)
    }
}

const sourceArr = [1,2,3,4,5,6,7,8,9,10]
// console.log(binarySearch(1, sourceArr) );//2


function eventLoopOrder() {
    setTimeout(function() {console.log(4)}, 0);
    process.nextTick(function () {
        console.log(6);
    })
    new Promise(function executor(resolve) {
        console.log(1);
        for( var i=0 ; i<10000 ; i++ ) {
            i == 9999 && resolve();
        }
        console.log(2);
    }).then(function() {
        console.log(5);
    });


    console.log(3);
}

// eventLoopOrder()





exports.test1 = async function pageIndex(ctx, next) {

    await ctx.render('test/test', { page : {title : 'Test page !'} });
}


exports.wx = async function pageIndex(ctx, next) {

    await ctx.render('test/wx');
}


