# Animate

To start the demo page execute `npm run start`.


## Building Blocks

### SVG and SVGShape

SVG is a comicVM-dom DomElement wrapping the HTML equivalent of: 
```
<div class="svg-canvas">
    <svg></svg>
</div>
```
SVG provides methods to add and remove SVGShapes.
SVGShape is the base class of all SVG Elements, like SVGRect (<rect> element), SVGCircle (<circle> element) e.g. 
When created, an SVGShape object creates a new DOM Element and adds it to the specified SVG element. It propagates property changes (position, size, color etc.) to that DOM element.

### Animations

AnimationSections must implement a render(time) method rendering the animated visual at a given time value between 0 and 1. Their startMillis and endMillis properties specify from when to when the section is played in the overall timeline.  
An Animation contains a set of AnimationSections or other Animations. For a given time it renders all AnimationSections contained in it. 
An Animator executes an Animation according to a configuration. It provides methods to start, stop and pause the animation.

To implement specific animations you can write extensions of the Animation and AnimationSection classes.
Or you can assign a render function to an AnimationSection's renderFn property or pass it to AnimationSection.create().

Examples:

* DrawingLineAnimation
* ...

### Penta

A Penta object represents a set of points and Lines between them forming a visual out of pentagonal shapes.
Each point has a name referring to a point in the body (e.g. head, elbowLeft, elbowRight, kneeLeft, kneeRight etc.).
The PentaMan object can draw an image of the Vitruvian Man by Leonardo da Vinci.
It also contains the points of a Penta object, but their positions are at the actual points in the Vitruvian Man's body (left elbow, right elbow etc.).
