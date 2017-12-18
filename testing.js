

printAll = (test) => {
    return {name: test,
            location: "here"
        };
};

(() => {
    let obj = {age: 12};
    // Object.assign(obj, printAll("lolz"));
    obj = {...obj, ...printAll("test")};
    console.log(obj);
})();