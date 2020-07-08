/**
 * Created by JinWYP on 20/02/2017.
 */



/**
 * describe 测试套件 test suite 表示一组相关的测试
 * it 测试用例 test case 表示一个单独的测试
 * assert 断言 表示对结果的预期
 */

const assert = require('assert');



describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function(){
            assert.strictEqual(-1, [1,2,3].indexOf(4));
        })

        it('length', function(){
            assert.strictEqual(3, [1, 2, 3].length);
        })
    })
});


const expect = require('chai').expect;

describe('chai expect demo', function() {
    it('expect equal', function() {
        expect(1+1).to.equal(2);
        expect(1+1).not.equal(3);
    });
});





function findMatch2(sourceArray, target ) {
    
    if (!Array.isArray(sourceArray)) {
        return 'sourceArray is not a array !'
    } 
    
    let resultFirst = [];
    let resultLast = [];
    let isFirstTime = true;
    let isFirst = false;
    
    const arrayLength = sourceArray.length;
    
    for (let i = 0; i < arrayLength; i++ ) {
        for (let j = i + 1; j < arrayLength; j++ ) {
            const temp = sourceArray[i] + sourceArray[j];
            
            if (sourceArray[i] >= sourceArray[j]) {
                isFirst = true
            }
            
            if (temp === target) {
                console.log('result: ', temp, target, [i, j], sourceArray);
                
                resultLast = [i, j];
                
                if (isFirstTime) {
                    resultFirst = [i, j];
                    isFirstTime = false;
                }
            }
        }
    }
    
    if (resultLast.length === 0) {
        return null;
    } else {
        if (isFirst) {
            return resultFirst;
        } else {
            return resultLast;
        }
    }
    
}


const findMatch = function(nums, target) {
    const temp = {};
    for(let i=0; i<nums.length; i++){
        const dif = target - nums[i];
        
        if(temp[dif] != undefined){
            console.log('result: ', i, dif, temp[dif], target, [temp[dif],i], temp);
            return [temp[dif],i];
        }
        
        if(temp[nums[i]] === undefined) {
            temp[nums[i]] = i;
        }
    }
    return null
};

describe('Match wifi key demo', function() {
    
    it('expect findMatch Null', function() {
        expect(findMatch([1], 15)).to.equal(null);
        expect(findMatch([2, 3, 4, 5, 6], 15)).to.equal(null);
        expect(findMatch([2, 3, 4, 5, 6], 2)).to.equal(null);
    });


    it('expect findMatch Exact', function() {
        expect( findMatch([2, 3, 4, 5, 6], 5)).to.deep.equal([0, 1])
        expect( findMatch([2, 3, 4, 5, 6], 7)).to.deep.equal([1, 2])
        expect( findMatch([2, 3, 4, 5, 6], 9)).to.deep.equal([2, 3])
        expect( findMatch([2, 3, 4, 6, 5], 9)).to.deep.equal([1, 3])
    });

    it('expect findMatch First', function() {
        expect( findMatch([2, 3, 1, 4, 6], 5)).to.deep.equal([0, 1])
    });

    it('expect findMatch First 2', function() {
        expect( findMatch([2, 2, 3, 4, 6], 5)).to.deep.equal([0, 2])
        expect( findMatch([7, 2, 3, 4, 6], 5)).to.deep.equal([1, 2])

    });

 

});


