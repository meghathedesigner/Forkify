import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.item =[];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.item.push(item);
        return item;
    }

    deleteItem(id){

        //findIndex gives index of the first elements that satisfies the provided testing fintion

        const index = this.item.findIndex(el => el.id === id);
        //[1,2,4] splice(1,2) => returns [2,4] orignal array is [1]
        //[1,2,4] slice(1,2) => returns [2] orignal array [1,2,4]

        this.item.splice(index, 1);
    }
        //find gives value of the first element in the provided array that satisfies the provided testing function.

    updateCount(id, newCount){
        this.item.find(el => el.id === id).count = newCount;
    }
}