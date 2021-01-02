import { createPentaPaintingDemo5 } from "./penta-painting-demo-5";
import { createPentaPaintingDemo } from "./penta-painting-demo";
import { createPentaPaintingDemo2 } from "./penta-painting-demo-2";
import { createPentaPaintingDemo3 } from "./penta-painting-demo-3";
import { createPentaPaintingDemo4 } from "./penta-painting-demo-4";

export function runPentaDemos(container) {

    createPentaPaintingDemo(container);
    createPentaPaintingDemo2(container);
    createPentaPaintingDemo3(container);
    createPentaPaintingDemo4(container);
    createPentaPaintingDemo5(container);

    const explanation = `
    
   ## Motivation
    
   The goal is balance, equilibrium of the body and its forces.
   To find balance we have to find symmetry.
   
   ## Body Symmetries

  ### 1. Left-Right Symmetry
   
   The most obvious symmetry in our body is the symmetry between left and right.
   
   ### 2. Symmetry of the Extremities
   
   Another still quite obvious symmetry is the symmetry between arms and legs, hands and feet.
   
   ### 3. Nested Symmetry

   The third less obvious symmetry is the self-similarity between certain outer and inner parts of the body.
   
   ## The Golden Spots

   During the exploration of my body's symmetries I identified a number of essential parts or spots (see penta man)
   It turns out that these spots can be thought of as the edges of a pentagram, 
   or, more precisely, as the edges of two nested pentagrams...
   
   Feeling these spots and their relations to each other in terms of force and balance
   and understanding the whole topography in pentagram shapes
   can be the key to new experiences of wholeness. 
   
   ## Interpretation
   
   The Golden Body Model is like an alphabet, a language to identify certain parts of the body 
   and to describe symmetries that can be found between these parts.
   
   
    `
}