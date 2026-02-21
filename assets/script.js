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

//draggavle window tampilan desktop only
// document.addEventListener("DOMContentLoaded", () => {
//     const draggableElements = document.querySelectorAll(".draggable");
//     const tampilanDesktop = () => window.matchMedia("(min-width: 769px)").matches;

//     draggableElements.forEach((win) => {
//         let dragging = false;
//         let posisiX = 0;
//         let posisiY = 0;
//         let isMoving = false;
//         const initX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
//         const initY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

//         function startDrag(e) {
//             if (!tampilanDesktop()) return;
//             const rect = win.getBoundingClientRect();
//             if (!isMoving) {
//                 win.style.transform = "none";
//                 win.style.left = rect.left + "px";
//                 win.style.top = rect.top + "px";
//                 isMoving = true;
//             }
//             posisiX = initX(e) - rect.left;
//             posisiY = initY(e) - rect.top;
//             dragging = true;
//             document.addEventListener("mousemove", drag);
//             document.addEventListener("mouseup", stopDrag);
//         }
//         function drag(e) {
//             if (!dragging) return;
//             let newLeft = initX(e) - posisiX;
//             let newTop = initY(e) - posisiY;

//             const maxX = window.innerWidth - win.offsetWidth;
//             const maxY = window.innerHeight - win.offsetHeight;
//             newLeft = Math.max(0, Math.min(newLeft, maxX));
//             newTop = Math.max(0, Math.min(newTop, maxY));
//             win.style.left = newLeft + "px";
//             win.style.top = newTop + "px";
//         }
//         function stopDrag() {
//             dragging = false;
//             document.removeEventListener("mousemove", drag);
//             document.removeEventListener("mouseup", stopDrag);
//         }
//         win.addEventListener("mousedown", startDrag);
//     });
// });

//modal 1 utk semua
const modal = document.getElementById("globalModal");
const modalWindow = modal.querySelector(".modal-window");
const modalImg = modal.querySelector(".modal-body img");
const modalTitle = modal.querySelector(".modal-title");
const closeBtn = modal.querySelector(".modal-close");

function openModal({ imgSrc, width = 600, height = "auto", title = "Preview" }) {
    if (!imgSrc) return;
    console.log(imgSrc);
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalWindow.style.width = width + "px";
    modalWindow.style.height = height === "auto" ? "auto" : height + "px";
    modal.classList.add("show");
}

function closeModal() {
    modal.classList.remove("show");
    modalImg.src = "";
}
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".zoom-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            const expItem = icon.closest(".exp-item");
            if (!expItem) return;
            const imgSrc = expItem.dataset.img;
            const imgTitle = expItem.dataset.title;
            const width = expItem.dataset.width || 600;
            openModal({
                imgSrc: imgSrc,
                width: Number(width),
                height: "auto",
                title: imgTitle
            });
        });
    });
});