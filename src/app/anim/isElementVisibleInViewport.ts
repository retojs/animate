const minVisible = 100 // the number of the element's pixels that need to be visible (horizontally and vertically)

export function isElementVisibleInViewport(element) {
    if (!element) return false

    var rect = element.getBoundingClientRect()

    return (
        rect.top + minVisible <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left + minVisible <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom - minVisible >= 0 &&
        rect.right - minVisible >= 0
    )
}