//teks pojok kiriatas
const text = "C:/Users/Visitor>";
const textSpeed = 200;
const textDelay = 6000;
let index = 0;
const visitorText = document.getElementById("visitor-text");

function mengetik() {
    if (index < text.length) {
        visitorText.innerHTML += text.charAt(index);
        index++;
        setTimeout(mengetik, textSpeed);
    } else {
        setTimeout(() => {
            visitorText.innerHTML = "";
            index = 0;
            mengetik();
        }, textDelay);
    }
}
mengetik();

//nav 
const navItems = document.querySelectorAll(".nav li");
const sections = document.querySelectorAll(".content-section");
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const target = item.getAttribute("data-target");
        sections.forEach(sections => {
            sections.classList.remove("active");
        })
        navItems.forEach(nav => {
            nav.classList.remove("active");
        })
        document.getElementById(target).classList.add("active");
        item.classList.add("active");
    });
});

// matterjs 
const { Engine, World, Bodies, Events } = Matter;
const btn = document.getElementById("unpin");
const wrapper = document.querySelector(".tools-wrapper");
const grid = document.querySelector(".tools-grid");
const containerGravitasi = document.querySelector(".container-gravitasi");
const items = document.querySelectorAll(".tool-item");
const msg = document.getElementById("tool-msg");

let engine;
let jatuh = false;

btn.addEventListener("click", () => {
    if (!jatuh) {
        jatuh = true;
        const rect = wrapper.getBoundingClientRect();
        engine = Engine.create();
        const world = engine.world;
        Engine.run(engine);

        const floor = Bodies.rectangle(
            rect.width / 2,
            rect.height + 20,
            rect.width,
            40,
            { isStatic: true }
        );
        const batasKiri = Bodies.rectangle(
            -20,
            rect.height / 2,
            40,
            rect.height,
            { isStatic: true }
        );
        const batasKanan = Bodies.rectangle(
            rect.width + 20,
            rect.height / 2,
            40,
            rect.height,
            { isStatic: true }
        );

        World.add(world, [floor, batasKiri, batasKanan]);
        grid.style.visibility = "hidden";//kalau jatuh grid ilank
        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const startX = itemRect.left - rect.left + itemRect.width / 2;
            const startY = itemRect.top - rect.top + itemRect.height / 2;
            const body = Bodies.rectangle(
                startX,
                startY,
                itemRect.width,
                itemRect.height,
                {
                    restitution: 0.4,
                    friction: 0.5
                }
            );
            World.add(world, body);
            const clone = item.cloneNode(true);
            clone.style.position = "absolute";
            clone.style.width = itemRect.width + "px";
            clone.style.height = itemRect.height + "px";
            clone.style.left = (startX - itemRect.width / 2) + "px";
            clone.style.top = (startY - itemRect.height / 2) + "px";
            clone.style.margin = 0;

            containerGravitasi.appendChild(clone);
            Events.on(engine, "afterUpdate", () => {
                clone.style.left = body.position.x - itemRect.width / 2 + "px";
                clone.style.top = body.position.y - itemRect.height / 2 + "px";
                clone.style.transform = `rotate(${body.angle}rad)`;
            });
        });
        btn.classList.replace("ri-unpin-line", "ri-pushpin-line");
        msg.style.display = "block";
    } else {
        jatuh = false;
        Matter.Engine.clear(engine);
        engine = null;
        containerGravitasi.innerHTML = "";
        grid.style.visibility = "visible";
        btn.classList.replace("ri-pushpin-line", "ri-unpin-line");
        msg.style.display = "none";
    }
});

// STRESS DRAGGABLE ASDKJADKJSA
const layerModal = document.getElementById("modalLayer");
const template = document.getElementById("modalTemplate");
const tampilanDesktop = () => window.matchMedia("(min-width: 769px)").matches;
let showWindows = [];
let zIdx = 1000;

function showModal({ imgSrc, width = 600, title = "Preview" }) {
    if (!imgSrc) return;
    const sudahBuka = showWindows.find(win => win.dataset.key === imgSrc);
    if (sudahBuka) {
        zIdx++;
        sudahBuka.style.zIndex = zIdx;
        console.log("cek modal sudah dibuka")
        return;
    }
    if (!tampilanDesktop()) {
        layerModal.innerHTML = "";
        showWindows = [];
    }
    if (tampilanDesktop() && showWindows.length >= 2) {
        const oldest = showWindows.shift();
        oldest.remove();
    }

    const clone = template.content.cloneNode(true);
    const windowModal = clone.querySelector(".modal-window");
    const img = clone.querySelector("img");
    const titleEl = clone.querySelector(".modal-title");
    img.src = imgSrc;
    titleEl.textContent = title;
    windowModal.style.width = width + "px";
    windowModal.dataset.key = imgSrc;

    zIdx++;
    windowModal.style.zIndex = zIdx;
    layerModal.appendChild(clone);

    const windowCreated = layerModal.lastElementChild;
    showWindows.push(windowCreated);
    if (tampilanDesktop()) {
        const loadingGambar = windowCreated.querySelector("img");
        if (loadingGambar.complete) {
            randomPosition(windowCreated);
            windowCreated.classList.add('modal-visible'); 
            draggable(windowCreated, ".modal-header", true);
        } else {
            loadingGambar.onload = () => {
                randomPosition(windowCreated);
                windowCreated.classList.add('modal-visible'); 
                draggable(windowCreated, ".modal-header", true);
            };
        }
    } else {
        centerMobile(windowCreated);
        windowCreated.classList.add('modal-visible');
    }
    closeBtn(windowCreated);
}
function randomPosition(win) {
    const container = layerModal;
    const maxX = container.clientWidth - win.offsetWidth;
    const maxY = container.clientHeight - win.offsetHeight;
    const randomX = Math.max(0, Math.random() * maxX);
    const randomY = Math.max(0, Math.random() * maxY);
    win.style.left = randomX + "px";
    win.style.top  = randomY + "px";
}
function centerMobile(win) {
    win.style.left = "50%";
    win.style.top = "50%";
    win.style.transform = "translate(-50%, -50%)";
    win.style.width = "90vw";
}
function closeBtn(win) {
    const btn = win.querySelector(".modal-close");
    if (!btn) return;

    btn.addEventListener("click", () => {
        win.remove();
        showWindows = showWindows.filter(w => w !== win);
    });
}
function draggable(win, handleSelector = null, useZIndex = true) {
    const desktop = layerModal;
    const handle = handleSelector ? win.querySelector(handleSelector) : win;
    if (!handle) return;

    let dragging = false;
    let posisiX = 0;
    let posisiY = 0;

    handle.addEventListener("mousedown", (e) => {
        dragging = true;
        const rect = win.getBoundingClientRect();
        const desktopRect = desktop.getBoundingClientRect();

        posisiX = e.clientX - rect.left;
        posisiY = e.clientY - rect.top;
        if (useZIndex) {
            zIdx++;
            win.style.zIndex = zIdx;
        }
        win.style.left = rect.left - desktopRect.left + "px";
        win.style.top  = rect.top  - desktopRect.top  + "px";
        win.style.transform = "none";
    });
    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const desktopRect = desktop.getBoundingClientRect();
        let newLeft = e.clientX - desktopRect.left - posisiX;
        let newTop  = e.clientY - desktopRect.top  - posisiY;
        const maxX = desktop.clientWidth - win.offsetWidth;
        const maxY = desktop.clientHeight - win.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop  = Math.max(0, Math.min(newTop, maxY));
        win.style.left = newLeft + "px";
        win.style.top  = newTop + "px";
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // init mainwindow
    // gajadi
    // const mainWindow = document.querySelector(".main-window");
    // if (mainWindow && tampilanDesktop()) {
    //     draggable(mainWindow, null, false);
    // }
    document.querySelectorAll(".zoom-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            const expItem = icon.closest(".exp-item");
            if (!expItem) return;
            showModal({
                imgSrc: expItem.dataset.img,
                width: Number(expItem.dataset.width || 600),
                title: expItem.dataset.title
            });
        });
    });
}); 