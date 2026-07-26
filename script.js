document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    initializeScrollReveal();
    initializeNavigationHighlight();
    initializeBinaryBackground();
});


/* =========================================================
   Theme toggle
   ========================================================= */

function initializeTheme() {
    const themeToggle = document.getElementById("theme-toggle");

    if (!themeToggle) {
        return;
    }

    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.setAttribute(
            "data-theme",
            savedTheme
        );
    }

    updateThemeButton(themeToggle);

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const nextTheme =
            currentTheme === "light"
                ? "dark"
                : "light";

        document.documentElement.setAttribute(
            "data-theme",
            nextTheme
        );

        localStorage.setItem(
            "portfolio-theme",
            nextTheme
        );

        updateThemeButton(themeToggle);
    });
}


function updateThemeButton(themeToggle) {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    if (currentTheme === "light") {
        themeToggle.textContent = "🌙";
        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );
    } else {
        themeToggle.textContent = "☀️";
        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );
    }
}


/* =========================================================
   Scroll reveal animation
   ========================================================= */

function initializeScrollReveal() {
    const revealElements =
        document.querySelectorAll(".scroll-reveal");

    if (!revealElements.length) {
        return;
    }

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (prefersReducedMotion) {
        revealElements.forEach((element) => {
            element.classList.add("active");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* =========================================================
   Navigation section highlighting
   ========================================================= */

function initializeNavigationHighlight() {
    const navigationLinks =
        document.querySelectorAll(
            '.nav-links a[href^="#"]'
        );

    const sections =
        document.querySelectorAll(
            "main section[id], footer[id]"
        );

    if (!navigationLinks.length || !sections.length) {
        return;
    }

    const linkMap = new Map();

    navigationLinks.forEach((link) => {
        const sectionId =
            link.getAttribute("href").replace("#", "");

        linkMap.set(sectionId, link);
    });

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visibleEntries =
                entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (firstEntry, secondEntry) =>
                            secondEntry.intersectionRatio -
                            firstEntry.intersectionRatio
                    );

            if (!visibleEntries.length) {
                return;
            }

            const activeSectionId =
                visibleEntries[0].target.id;

            navigationLinks.forEach((link) => {
                link.classList.remove("current-section");
            });

            const activeLink =
                linkMap.get(activeSectionId);

            if (activeLink) {
                activeLink.classList.add(
                    "current-section"
                );
            }
        },
        {
            threshold: [0.2, 0.35, 0.5, 0.7],
            rootMargin: "-20% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* =========================================================
   Animated binary background
   ========================================================= */

function initializeBinaryBackground() {
    const leftContainer =
        document.getElementById("binary-left");

    const rightContainer =
        document.getElementById("binary-right");

    if (!leftContainer || !rightContainer) {
        return;
    }

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const rowCount = 19;

    generateBinarySide(
        leftContainer,
        rowCount,
        "left"
    );

    generateBinarySide(
        rightContainer,
        rowCount,
        "right"
    );

    if (prefersReducedMotion) {
        return;
    }

    /*
        Regenerate the strings occasionally so the background
        feels alive without changing rapidly or becoming distracting.
    */

    window.setInterval(() => {
        refreshBinaryStrings(leftContainer);
        refreshBinaryStrings(rightContainer);
    }, 45000);
}


function generateBinarySide(
    container,
    rowCount,
    side
) {
    const fragment =
        document.createDocumentFragment();

    for (
        let rowIndex = 0;
        rowIndex < rowCount;
        rowIndex += 1
    ) {
        const row =
            document.createElement("div");

        row.classList.add("binary-row");

        const movesLeft =
            side === "left"
                ? rowIndex % 2 === 0
                : rowIndex % 2 !== 0;

        row.classList.add(
            movesLeft
                ? "binary-move-left"
                : "binary-move-right"
        );

        const characterCount =
            getRandomInteger(38, 82);

        const duration =
            getRandomInteger(10, 40);

        const delay =
            getRandomInteger(-100, 0);

        const opacity =
            getRandomFloat(0.40, 0.80);

        const fontSize =
            getRandomFloat(0.58, 0.78);

        const distance =
            getRandomInteger(30, 48);

        row.textContent =
            generateBinaryString(characterCount);

        row.dataset.characterCount =
            String(characterCount);

        row.style.setProperty(
            "--binary-duration",
            `${duration}s`
        );

        row.style.setProperty(
            "--binary-delay",
            `${delay}s`
        );

        row.style.setProperty(
            "--binary-row-opacity",
            opacity.toFixed(3)
        );

        row.style.setProperty(
            "--binary-font-size",
            `${fontSize.toFixed(2)}rem`
        );

        row.style.setProperty(
            "--binary-distance",
            `${distance}%`
        );

        fragment.appendChild(row);
    }

    container.replaceChildren(fragment);
}


function refreshBinaryStrings(container) {
    const rows =
        container.querySelectorAll(".binary-row");

    rows.forEach((row) => {
        const storedLength =
            Number(row.dataset.characterCount);

        const characterCount =
            Number.isFinite(storedLength)
                ? storedLength
                : getRandomInteger(38, 82);

        row.textContent =
            generateBinaryString(characterCount);
    });
}


function generateBinaryString(length) {
    let binaryString = "";

    for (
        let characterIndex = 0;
        characterIndex < length;
        characterIndex += 1
    ) {
        binaryString +=
            Math.random() < 0.5
                ? "0"
                : "1";

        /*
            Add occasional spaces so the rows look like
            groups of machine code instead of one solid block.
        */

        if (
            characterIndex > 0 &&
            characterIndex % 8 === 7 &&
            characterIndex < length - 1
        ) {
            binaryString += " ";
        }
    }

    return binaryString;
}


function getRandomInteger(minimum, maximum) {
    return Math.floor(
        Math.random() *
            (maximum - minimum + 1)
    ) + minimum;
}


function getRandomFloat(minimum, maximum) {
    return (
        Math.random() *
            (maximum - minimum)
    ) + minimum;
}