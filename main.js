let start_time_ms = 0;
let duration_ms = 10000;

let original_offset;
let current_offset;

let interval;

// ui
let start_button;
let reset_button;
let time_left_label;
let time_left_ms_label;
let time_input;
let start_time_label;

const UPDATE_RATE = 64;

// Two MODES: START und AATTACH

const start_timer = (e) => {
    if (duration_ms === undefined) return;

    clearInterval(interval);
    start_time_ms = Date.now();
    original_offset = new Date().getTimezoneOffset();
    e.preventDefault();

    // set url
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('timer', duration_ms);
    urlParams.set('start', start_time_ms);
    urlParams.set('originaloffset', original_offset);

    window.location.search = urlParams;
}

const attach_to_timer = () => {
    clearInterval(interval);
    show_time_left();
}

// ---------------------------------------------------

const each_frame = () => {
    const time_now = Date.now();
    let time_left_ms = start_time_ms - (original_offset * 60 * 1000) + duration_ms - time_now + (current_offset * 60 * 1000);
    current_offset = new Date().getTimezoneOffset();

    if (time_left_ms <= 0) {
        clearInterval(interval);
        time_left_ms = 0;
    }
    time_left_ms_label.value = time_left_ms;

    let temp_hours = Math.floor((time_left_ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let temp_minutes = Math.floor((time_left_ms % (1000 * 60 * 60)) / (1000 * 60));
    let temp_seconds = Math.floor((time_left_ms % (1000 * 60)) / 1000);

    let str = ("0" + temp_hours).slice(-2) + ":" + ("0" + temp_minutes).slice(-2) + ":" + ("0" + temp_seconds).slice(-2);

    time_left_label.valueAsNumber = time_left_ms;
    time_left_label.innerHTML = str;
}

const show_time_left = () => {
    each_frame();
    interval = setInterval(each_frame, UPDATE_RATE);
}

const update_timer = (e) => {
    if (e.target.value === null) return;

    let date = e.target.value.split(":");

    hours = parseInt(date[0]);
    minutes = parseInt(date[1]);
    seconds = parseInt(date[2]);

    duration_ms = e.target.valueAsNumber;
}

const reset = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('timer', duration_ms);
    urlParams.delete('start', start_time_ms);
    urlParams.delete('originaloffset', start_time_ms);

    window.location.search = urlParams;

}

const init = () => {
    start_button = document.getElementById("start_button");
    reset_button = document.getElementById("reset_button");

    time_left_ms_label = document.getElementById("time_left_ms");
    time_left_label = document.getElementById("time_left");

    time_input = document.getElementById("time_input");

    time_left_ms_label.value = '';
    time_left_label.value = '';
    time_input.value = '';

    start_button.onclick = start_timer;
    reset_button.onclick = reset;
    time_input.onchange = update_timer;

    // IF params are set => attach 
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("timer") && urlParams.has("start") 
        && urlParams.has("originaloffset")) {
        duration_ms = parseInt(urlParams.get("timer"));
        start_time_ms = parseInt(urlParams.get("start"));
        original_offset = parseInt(urlParams.get("originaloffset"));
        attach_to_timer();
    }
}

window.onload = function () {
    console.log("RELOAD");
    init();
};

