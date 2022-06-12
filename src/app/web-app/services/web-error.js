WebErrorList = {
    0:'Erreur inconnue',
    400:'Veuillez revérifier les champs.',
    401:'Non authorisé',
    404:'Donnée non trouvée ou serveur injoignable.',
    409:'Vous avez déja un compte.',
    500:'Erreur serveur'
}

window.WebError = (status = 0) => { return WebErrorList[status] }