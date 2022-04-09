class Utils {
    age(birthday) {
        birthday = new Date(birthday)
        var month_diff = Date.now() - birthday.getTime();  
        var age_dt = new Date(month_diff);   
        var year = age_dt.getUTCFullYear();  
        var age = Math.abs(year - 1970);

        return age
    }
}

window['utils'] = new Utils()