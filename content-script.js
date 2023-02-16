console.debug('[SI-SAMU extension] Extension loading...');

async function call(number) {
    // Type in number
    const phoneNumberInput = document.querySelector('input[name="phoneNumber"]');
    phoneNumberInput.value = number;
    // Trigger phone number reformat / confirmation
    phoneNumberInput.dispatchEvent(new Event('input'));
    // Call
    document.querySelector('span[data-tnr="clavier-appeler"]').click()
}

async function clipboardCall() {
    // Collect value from clipboard
    let text = await navigator.clipboard.readText();
    // Remove whitespaces and dots in number (otherwise would fail regexp correct number validation)
    let number = text.replace(/ /g,'')
                     .replace(/\./g,'');
    console.debug({text, number});
    // Validate correct number
    const numberFormat = new RegExp('^([#\+\*]|37000|00+)?[0-9]{2,15}$')
    if (numberFormat.test(number)) {
        await call(number);
    } else {
        const shortClipboardValue = text.length < 20 ? text : text.substring(0, 17) + '...';
        alert("Pour appeler depuis le presse-papier, veuillez copier un n° de téléphone valide.\n" +
              "'" + shortClipboardValue + "' ne correspond pas à une valeur compatible.");
    }
}

waitForElm('button[data-tnr="bandeau-nouvel-appel"]').then((newCallElem) => {
    console.debug('[SI-SAMU extension] Extension initializing...');

    // Clean old state for extension reload to be effective
    if (document.getElementById('clipboardCall')) {
        document.getElementById('clipboardCall').remove();
    }

    // Add clipboard call icon
    newCallElem.insertAdjacentHTML(
        "beforebegin",
        `<div id='clipboardCall'>   
               <i class="far fa-clipboard fa-lg fa-inverse"></i>
        </div>`
    )

    // Add listener to clipboard call click
    document.getElementById('clipboardCall').addEventListener("click", clipboardCall);

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
