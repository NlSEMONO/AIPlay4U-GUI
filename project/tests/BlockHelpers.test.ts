import { PositionedBlock } from "../src/utils/Definitions";
const { getBlockById, cloneBlocks, replaceBlockById, removeBlockById } = require("../src/components/blocks/BlockHelpers.tsx");

// *******************************
// getBlockById
// *******************************

const set_simple: PositionedBlock = {
    id: 99, x: 100, y: 200, body: null, next: null, code: "", blockType: "ASSIGN VARIABLE"
}

const if_simple: PositionedBlock = {
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

const if_nested_1: PositionedBlock = {
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

const times_nested_1: PositionedBlock = {
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

// *******************************
// cloneBlocks
// *******************************

test("TEST CLONE GENERAL", () =>{
    let inputArr1 = [ if_nested_1, times_nested_2 ];
    let inputArr2 = [ times_nested_2, if_nested_1 ];
    let inputArr3 = [ times_nested_1, if_nested_1 ];

    expect(cloneBlocks(inputArr1)).toStrictEqual(inputArr1);
    expect(cloneBlocks(inputArr2)).toStrictEqual(inputArr2);
    expect(cloneBlocks(inputArr3)).toStrictEqual(inputArr3);
});

// *******************************
// replaceBlockById
// *******************************

test("TEST REPLACE GENERAL", () =>{
    let inputArr1 = [ if_nested_1, times_nested_2 ];
    let if_nested_mod = if_nested_1;
    if_nested_1.x = 10;
    let times_nested_2_mod = times_nested_2;
    times_nested_2_mod.x = 10;
    times_nested_2_mod.y = 20;

    replaceBlockById(0, if_nested_mod, inputArr1);
    let test1_out = [if_nested_mod, times_nested_2];
    expect(inputArr1).toStrictEqual(test1_out);

    replaceBlockById(2, times_nested_2_mod, inputArr1)
    let test2_out = [if_nested_mod, times_nested_2_mod];
    expect(inputArr1).toStrictEqual(test2_out);
});

// *******************************
// removeBlockById
// *******************************

test("TEST REMOVE BY ID SIMPLE", () =>{
    expect(removeBlockById(0, if_nested_1)).toBe(null);

    let test2_out = if_nested_1;
    test2_out.body = null;
    expect(removeBlockById(5, if_nested_1)).toStrictEqual(test2_out);

    let test3_out = if_nested_1;
    test3_out.next = null;
    expect(removeBlockById(1, if_nested_1)).toStrictEqual(test2_out);
}); 

test("TEST REMOVE BY ID NESTED", () =>{
    let test1_in = set_simple;
    let test1_sub = if_simple;
    test1_sub.body = times_nested_1;
    test1_in.next = test1_sub;
    let test1_out = set_simple;
    let test1_out_sub = if_simple;
    test1_out_sub.next = null;
    test1_out.next = test1_out_sub;
    expect(removeBlockById(1, test1_in)).toStrictEqual(test1_out);
    
    let test2_in = set_simple;
    let test2_sub = if_simple;
    test2_sub.body = times_nested_1;
    test2_in.next = test2_sub;
    let test2_out = set_simple;
    test2_out.next = if_simple;
    expect(removeBlockById(2, test2_in)).toStrictEqual(test2_out);

    let test3_in = if_simple;
    test3_in.body = times_nested_1;
    let test3_out = if_simple;
    let test3_sub = times_nested_1;
    test3_sub.body = null;
    expect(removeBlockById(4, test3_in)).toStrictEqual(test3_out);

    let test4_in = if_simple;
    test4_in.body = times_nested_1;
    let test4_out = if_simple;
    let test4_sub = times_nested_1;
    test4_sub.next = null;
    expect(removeBlockById(3, test4_in)).toStrictEqual(test4_out);
}); 