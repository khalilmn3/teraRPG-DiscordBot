import NodeCache from "node-cache";
const myCache = new NodeCache();


let obj = { my: "Special", variable: 42 };

 myCache.mset([
    {key: "myKey", val: obj}
])


export default myCache;