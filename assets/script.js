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

const navItems = document.querySelectorAll(".nav li");
const sections = document.querySelectorAll(".content-section");
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const target = item.getAttribute("data-target");
        sections.forEach(sections => {
            sections.classList.remove("active");
        })
        document.getElementById(target).classList.add("active");
    });
});
const { Engine, World, Bodies, Events } = Matter;

const btn = document.getElementById("unpin");
const wrapper = document.querySelector(".tools-wrapper");
const grid = document.querySelector(".tools-grid");
const physicsContainer = document.querySelector(".container-gravitasi");
const items = document.querySelectorAll(".tool-item");

let engine;
let activated = false;

btn.addEventListener("click", () => {

    if (activated) return;
    activated = true;

    const rect = wrapper.getBoundingClientRect();

    engine = Engine.create();
    const world = engine.world;

    Engine.run(engine);

    // === TEMBOK ===
    const ground = Bodies.rectangle(
        rect.width / 2,
        rect.height + 20,
        rect.width,
        40,
        { isStatic: true }
    );

    const leftWall = Bodies.rectangle(
        -20,
        rect.height / 2,
        40,
        rect.height,
        { isStatic: true }
    );

    const rightWall = Bodies.rectangle(
        rect.width + 20,
        rect.height / 2,
        40,
        rect.height,
        { isStatic: true }
    );

    World.add(world, [ground, leftWall, rightWall]);

    // sembunyikan flex
    grid.style.visibility = "hidden";

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

        physicsContainer.appendChild(clone);

        Events.on(engine, "afterUpdate", () => {
            clone.style.left = body.position.x - itemRect.width / 2 + "px";
            clone.style.top = body.position.y - itemRect.height / 2 + "px";
            clone.style.transform = `rotate(${body.angle}rad)`;
        });
    });

});