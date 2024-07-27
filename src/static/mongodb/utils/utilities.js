function ensureContainsOnlyAlphaNumeric(str) {
    let regex = /[^A-Za-z0-9]/g;
    let result = str.replace(regex, "");
    return result;
  }