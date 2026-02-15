//teks pojok kiriatas
const text = "C:/Users/Visitor>";
const textSpeed = 200;
const textDelay = 6000;
let index = 0;
const visitorText = document.getElementById("visitor-text");

function mengetik() {
    if (index<text.length) {
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
        sections.forEach(section => {
            section.classList.remove("active");
        })
        document.getElementById(target).classList.add("active");
    });
});

// matterjs 
const { Engine, World, Bodies, Events } = Matter;
const btn = document.getElementById("unpin");
const wrapper = document.querySelector(".tools-wrapper");
const grid = document.querySelector(".tools-grid");
const containerGravitasi = document.querySelector(".container-gravitasi");
const items = document.querySelectorAll(".tool-item");

let engine;
let jatuh = false;

btn.addEventListener("click", () => {
    if (jatuh) return;
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
});