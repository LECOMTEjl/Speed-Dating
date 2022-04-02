class Redirect {
    to(url = '') { window.location.replace(environment.appUrl + url); }
}

window['redirect'] = new Redirect