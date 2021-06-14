export default function itemName(commandBody) {
    // itemName = itemName.slice(6);
    let argument = commandBody
    let qty = argument.match(/\d+/g);
    qty = qty ? qty[0] : 1;
    let arrayName = argument.match(/[a-zA-Z]+/g);
    let itemName = '';
    arrayName = arrayName.splice(1);
    arrayName.forEach(element => {
        if (itemName) {
            itemName += ' ';
        }
        itemName += element;
    });

    return {
        itemName: itemName,
        itemQty: qty
    };
}