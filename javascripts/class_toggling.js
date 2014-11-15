// Toggle className on and off among children elements of the parentElement,
// switching to the next child after given duration.
// Assume that none have the class when this is first called.
function toggleClassAmongChildren(parentElement, childSelector, className, interval) {
    var children = parentElement.querySelectorAll(childSelector),
        current_child = 1 % children.length,
        previous_child = 0;
    children[previous_child].classList.add(className);
    function repeat() {
        children[current_child].classList.add(className);
        children[previous_child].classList.remove(className);
        previous_child = current_child;
        current_child = (current_child+1)%children.length;
    }
    setInterval(repeat, interval);
}
