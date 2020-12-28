import { createPentaPaintingDemo } from "./penta-painting-demo";
import { createPentaPaintingDemo2 } from "./penta-painting-demo-2";
import { createPentaPaintingDemo3 } from "./penta-painting-demo-3";
import { createPentaPaintingDemo4 } from "./penta-painting-demo-4";

export function runPentaDemos(container) {

    createPentaPaintingDemo(container);
    createPentaPaintingDemo2(container);
    createPentaPaintingDemo3(container);
    createPentaPaintingDemo4(container);
}