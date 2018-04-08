document.addEventListener('mousemove', (e) => {
    browser.runtime.sendMessage({event: "mouse_move", x: e.clientX, y: e.clientY, buttons: e.buttons});
});

document.addEventListener('mousedown', (e) => {
    browser.runtime.sendMessage({event: "mouse_down", x: e.clientX, y: e.clientY, which: e.which});
});

/*document.addEventListener('mouseup', (e) => {
    browser.runtime.sendMessage({event: "mouse_up", x: e.clientX, y: e.clientY});
});*/

document.addEventListener('wheel', (e) => {
    browser.runtime.sendMessage({event: "wheel", x: e.clientX, y: e.clientY});
});

document.addEventListener('keydown', (e) => {
    browser.runtime.sendMessage({event: "key_down", which: e.which});
});

window.addEventListener('resize', function(event){
    browser.runtime.sendMessage({event: "resize"});
});
