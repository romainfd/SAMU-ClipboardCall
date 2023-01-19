console.debug('[SI-SAMU extension] Extension loading...');

// Print the copied number from clipboard
async function printSelection() {
    console.debug(await navigator.clipboard.readText());
}

waitForElm('button[data-tnr="bandeau-nouvel-appel"]').then((newCallElem) => {
    console.debug('[SI-SAMU extension] Extension initializing...');

    newCallElem.insertAdjacentHTML(
        "beforebegin",
        `<div id='clipboardCall'>   
               <i class="far fa-clipboard fa-lg fa-inverse"></i>
        </div>`
    )

    // Add copySelection() as a listener to mouseup events.
    document.getElementById('clipboardCall').addEventListener("click", printSelection);

    console.debug('[SI-SAMU extension] Extension initialized.');
});

// HELPERS
// Ref.: https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

console.debug('[SI-SAMU extension] Extension loaded.');
