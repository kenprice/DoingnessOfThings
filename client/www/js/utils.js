function validateAlphaNumeric(str){
    if( /[^a-zA-Z0-9]/.test( str ) ) {
       return false;
    }
    return true;     
 }