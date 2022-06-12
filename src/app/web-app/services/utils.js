class Utils {
    age(birthday) {
        birthday = new Date(birthday)
        let month_diff = Date.now() - birthday.getTime();  
        let age_dt = new Date(month_diff);   
        let year = age_dt.getUTCFullYear();  
        let age = Math.abs(year - 1970);

        return age
    }
}

window['utils'] = new Utils()