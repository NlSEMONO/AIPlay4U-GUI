const { getBlockById, cloneBlocks, replaceBlockById, getParent,
    getTarget, removeBlockById } = require("./BlockHelpers.tsx");

// *******************************
// getBlockById
// *******************************

const if_simple = {
    id: 0,
    x: 0,
    y: 0,
    blockType: "IF",
    body: null,
    next: {
        id: 1,
        blockType: "END",
        next: null, 
        body: null,
        code: ""
    },
    code: "",
};

test("GET BLOCK BY ID SIMPLE", () =>{
    let inputArr = [if_simple];

    expect(getBlockById(0, inputArr)).toBe(if_simple);
    expect(getBlockById(1, inputArr)).toBe(if_simple.next);
    expect(getBlockById(-1, inputArr)).toBe(null);
});

const if_nested_1 = {
    id: 0,
    x: 0,
    y: 0,
    blockType: "IF",
    body: {
        id: 5,
        blockType: "SET",
        next: null, 
        body: null,
        code: "",
    },
    next: {
        id: 1,
        blockType: "END",
        next: null, 
        body: null,
        code: ""
    },
    code: "",
}

const times_nested_1 = {
    id: 2,
    x: 0,
    y: 0,
    blockType: "REPEAT TIMES",
    body: {
        id: 4,
        blockType: "ASSIGN VARIABLE",
        next: null, 
        body: null,
        code: "",
    },
    next: {
        id: 3,
        blockType: "END",
        next: null, 
        body: null,
        code: ""
    },
    code: "",
}

test("GET BLOCK BY ID NESTED", () =>{
    let inputArr = [ if_nested_1, times_nested_1 ];

    expect(getBlockById(0, inputArr)).toBe(if_nested_1);
    expect(getBlockById(5, inputArr)).toBe(if_nested_1.body);
    expect(getBlockById(1, inputArr)).toBe(if_nested_1.next);
    expect(getBlockById(3, inputArr)).toBe(times_nested_1.next);
    expect(getBlockById(4, inputArr)).toBe(times_nested_1.body);
    expect(getBlockById(2, inputArr)).toBe(times_nested_1);
});

const times_nested_2 = { 
    id: 2, x: 0, y: 0, blockType: "REPEAT TIMES",
    body: { id: 4, blockType: "ASSIGN VARIABLE", body: null,
        next: { id: 6, blockType: "SET VARIABLE", body: null, 
                                                next: { id: 10, blockType: "IF", code: "",
                                                    body: { id: 12, blockType: "SET VARIABLE", next: null, body: null, code: ""},
                                                    next: { id: 11, blockType: "END", next: null, body: null, code: ""}},  code: ""},
        code: ""},
    next: { id: 3, blockType: "END", body: null, 
                                    next: { id: 7, blockType: "IF", code: "",
                                        body: { id: 9, blockType: "SET VARIABLE", next: { id: 13, blockType: "SET VARIABLE", next: null, body: null, code: ""}, body: null, code: ""},
                                        next: { id: 8, blockType: "END", next: null, body: null, code: ""}}, 
                                    
        code: ""},
    code: "",
}

test("GET BLOCK BY ID NESTED 2", () =>{
    let inputArr = [ if_nested_1, times_nested_2 ];

    // target cases where there are nested blocks within the items of the arrays themselves
    expect(getBlockById(6, inputArr)).toBe(times_nested_2.body.next);
    expect(getBlockById(3, inputArr)).toBe(times_nested_2.next);
    expect(getBlockById(9, inputArr)).toBe(times_nested_2.next.next.body);
    expect(getBlockById(10, inputArr)).toBe(times_nested_2.body.next.next);
    expect(getBlockById(11, inputArr)).toBe(times_nested_2.body.next.next.next);
    expect(getBlockById(12, inputArr)).toBe(times_nested_2.body.next.next.body);
    expect(getBlockById(13, inputArr)).toBe(times_nested_2.next.next.body.next);
    expect(getBlockById(8, inputArr)).toBe(times_nested_2.next.next.next);
});