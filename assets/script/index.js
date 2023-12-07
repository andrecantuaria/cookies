'use strict';

function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function select(selector, parent = document) {
    return parent.querySelector(selector);
}

function getElement(selector, parent = document) {
    return parent.getElementById(selector);
}

// Modal Elements
const modal = select('.modal');
const overlay = select('.overlay');
const settingsBtn = select('.settings-btn');
const acceptBtn = select('.accept-btn');
const acceptSelectedBtn = select('.accept-selected-btn');
const savePreferencesBtn = select('.save-preferences-btn');
const modalDefault = select('.modal-default');
const modalSettings = select('.modal-settings');

const browserSwitch = select('.browser-switch');
const operatingSystemSwitch = select('.operating-system-switch');
const screenWidthSwitch = select('.screen-width-switch');
const screenHeigthSwitch = select('.screen-heigth-switch');

const browserData = navigator.userAgentData;
const operatingSystem = navigator.platform;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Check for cookies when the page is loaded
onEvent('DOMContentLoaded', document, function () {
    if (!hasCookies()) {
        openModal();
    }
});

// Function to check if cookies exist
function hasCookies() {
    const requiredCookies = ['Browser', 'OperatingSystem', 'ScreenWidth', 'ScreenHeight'];

    for (const cookieName of requiredCookies) {
        if (getCookie(cookieName)) {
            console.log(`Cookie ${cookieName} found.`);
            return true;
        }
    }

    console.log('No required cookies found.');
    return false;
}

// Open the modal
function openModal() {
    setTimeout(() => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            overlay.classList.add('show-overlay');
            checkSwitches(); // Verificar os switches quando o modal é aberto
        }, 10);
    }, 100);
}

// Close the modal
function closeModal() {
    modal.classList.remove('show');
    overlay.classList.remove('show-overlay');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 1000);
}

// Accept All Cookies
onEvent('click', acceptBtn, function () {
    checkSwitches(); 
    acceptBrowserNameCookie();
    acceptOperatingSystemCookie();
    acceptScreenWidthCookie();
    acceptScreenHeightCookie();
    closeModal();
});

onEvent('click',acceptSelectedBtn, function () {
    checkSwitches(); 
    acceptBrowserNameCookie();
    acceptOperatingSystemCookie();
    acceptScreenWidthCookie();
    acceptScreenHeightCookie();
    closeModal();
});


// check if all switches are checked when the page loads
const selectedSwitches = [browserSwitch, operatingSystemSwitch, screenWidthSwitch, screenHeigthSwitch];
selectedSwitches.forEach(switchElement => switchElement.checked = true);

// Event to check the switches when they are changed
selectedSwitches.forEach(switchElement => {
    switchElement.addEventListener('change', checkSwitches);
});

function checkSwitches() {
    let anySwitchUnchecked = false;

    if (!browserSwitch.checked) {

        //console.log('Browser switch is not checked');
        anySwitchUnchecked = true;
    }

    if (!operatingSystemSwitch.checked) {
        //console.log('Operating System switch is not checked');
        anySwitchUnchecked = true;
    }

    if (!screenWidthSwitch.checked) {
        //console.log('Screen Width switch is not checked');
        anySwitchUnchecked = true;
    }

    if (!screenHeigthSwitch.checked) {
        //console.log('Screen Height switch is not checked');
        anySwitchUnchecked = true;
    }

    if (anySwitchUnchecked) {
        // If at least one switch is not selected, display acceptSelectedBtn
        acceptBtn.style.display = 'none';
        acceptSelectedBtn.style.display = 'inline-block';
    } else {
        // If all switches are selected, display acceptBtn
        acceptBtn.style.display = 'inline-block';
        acceptSelectedBtn.style.display = 'none';
    }
}

checkSwitches();

function acceptBrowserNameCookie() {
    if (browserSwitch.checked) {
        const browserName = browserData ? browserData.brands[0].brand : "Not identified";
        console.log(`Browser: ${browserName}`);
        setCookie("Browser", browserName);
    } else {
        console.log('Browser switch is not checked, no cookie will be created.');
    }
}

function acceptOperatingSystemCookie() {
    if (operatingSystemSwitch.checked) {
        console.log(`Operating System: ${operatingSystem}`);
        setCookie("OperatingSystem", operatingSystem);
    } else {
        console.log('Operating System switch is not checked, no cookie will be created.');
    }
}

function acceptScreenWidthCookie() {
    if (screenWidthSwitch.checked) {
        console.log(`Screen Width: ${screenWidth}`);
        setCookie("ScreenWidth", screenWidth);
    } else {
        console.log('Screen Width switch is not checked, no cookie will be created.');
    }
}

function acceptScreenHeightCookie() {
    if (screenHeigthSwitch.checked) {
        console.log(`Screen Height: ${screenHeight}`);
        setCookie("ScreenHeight", screenHeight);
    } else {
        console.log('Screen Height switch is not checked, no cookie will be created.');
    }
}

onEvent('click', settingsBtn, function () {
    modalDefault.style.display = 'none';
    modalSettings.style.display = 'block';
});

onEvent('click', savePreferencesBtn, function () {
    modalDefault.style.display = 'block';
    modalSettings.style.display = 'none';
});

function setCookie(name, value, seconds = 10) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + seconds * 1000);

    const cookieValue = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/; SameSite=Lax";

    document.cookie = cookieValue;
}

function getCookie(cookieName) {
    const name = encodeURIComponent(cookieName) + '=';
    const cookies = document.cookie.split('; ');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length, cookie.length));
        }
    }

    return null;
}
